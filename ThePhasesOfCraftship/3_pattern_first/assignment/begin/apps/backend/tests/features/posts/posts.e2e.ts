import { CompositionRoot } from "../../../src/shared/compositionRoot";
import { Types as MemberTypes, Types } from "@dddforum/api/members";
import { Inputs as PostInputs } from "@dddforum/api/posts";
import { Config } from "@dddforum/config";
import { createAPIClient, Posts } from "@dddforum/api";
import { setupPost } from "../../fixtures/e2e/posts";
import { createFakeIdToken } from "../../fixtures/e2e/users";
import { DatabaseFixture } from "../../fixtures/e2e/database";
import { setupLevel1Member, setupLevel2Member } from "../../fixtures/e2e/members";
import { randomUUID } from "crypto";
import { MemberReputationLevel } from "../../../src/modules/members/domain/member";

jest.setTimeout(30000);

describe("posts", () => {
  let databaseFixture: DatabaseFixture;
  const apiClient = createAPIClient("http://localhost:3000");
  let appComposition: CompositionRoot;
  const config: Config = Config();

  beforeAll(async () => {
    appComposition = CompositionRoot.createCompositionRoot(config);
    databaseFixture = new DatabaseFixture(appComposition);
    await appComposition.start();
  });

  afterAll(async () => {
    await appComposition.stop();
  });

  describe("identity & permissions", () => {
    it("should not be able to create a post if they are level 1", async () => {
      const { token, userId } = await createFakeIdToken();
      const level1Member = await setupLevel1Member(apiClient, token, userId);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "link",
        title: "Test post",
        content: "This is a test post",
        memberId: level1Member.member.memberId,
      };

      const response = await apiClient.posts.create(post, token);

      expect(response.success).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error?.code).toBe(403);
      expect(response.error?.message).toContain("Permission Error");
    });
  });

  describe("creating new posts", () => {
    it("as a level 2 member, it can create a link post", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "link",
        title: "Test post",
        content: "This is a test link post",
        memberId: level2Member.updatedMember.id,
        link: "http://sample.link",
      };

      const response = await apiClient.posts.create(post, token);

      expect(response.success).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(response.data?.link).toBe(post.link);
      expect(response.data?.title).toBe(post.title);
      expect(response.data?.content).toBe(post.content);
    });

    it("should have an initial upvote when creating a post", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "link",
        title: "Test post",
        content: "This is a test link post",
        memberId: level2Member.updatedMember.id,
        link: "http://sample.link",
      };

      const response = await apiClient.posts.create(post, token);

      expect(response.success).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(response.data?.link).toBe(post.link);
      expect(response.data?.title).toBe(post.title);
      expect(response.data?.content).toBe(post.content);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedPost = await apiClient.posts.getPostById(response.data!.id);
      expect(updatedPost.data?.voteScore).toBe(1);
    }, 15000);

    it("cannot create a link post without supplying a link", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "link",
        title: "Test post",
        content: "This is a test link post",
        memberId: level2Member.updatedMember.id,
      };

      const response = await apiClient.posts.create(post, token);

      expect(response.success).toBeFalsy();
      expect(response.error).toBeTruthy();
      expect(response.error?.code).toBe(400);
    });

    it("cannot create a text post without supplying content", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "text",
        title: "",
        memberId: level2Member.updatedMember.id,
      };

      const response = await apiClient.posts.create(post, token);

      expect(response.success).toBeFalsy();
      expect(response.error).toBeTruthy();
    });
  });

  describe("fetching posts", () => {
    it("can fetch a previously created post by id", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      const post: Posts.Inputs.CreatePostInput = {
        postType: "text",
        title: "Test post",
        content: "This is a another test post",
        memberId: level2Member.updatedMember.id,
      };

      const response = await apiClient.posts.create(post, token);
      const createdPost = await apiClient.posts.getPostById(response.data!.id);

      expect(createdPost.success).toBeTruthy();
      expect(createdPost.data).toBeTruthy();
      expect(createdPost.data?.id).toBe(response.data?.id);
      expect(createdPost.data?.content).toBe(response.data?.content);
      expect(createdPost.data?.title).toBe(response.data?.title);
      expect(createdPost.data?.postType).toBe(response.data?.postType);
    });

    it("returns a not found error if the post does not exist", async () => {
      const createdPost = await apiClient.posts.getPostById(randomUUID());

      expect(createdPost.success).toBeFalsy();
      expect(createdPost.error).toBeTruthy();
      expect(createdPost.error?.code).toBe("PostNotFound");
      expect(createdPost.error?.message).toBe("Post not found.");
    });

    it("can fetch recent posts", async () => {
      const response = await apiClient.posts.getPosts({ sort: "recent" });

      const first = response.data?.[0].dateCreated;
      const next = response.data?.[1].dateCreated;

      expect(response.success).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(new Date(String(first)).getTime()).toBeGreaterThan(new Date(String(next)).getTime());
    });

    it('can fetch "popular" posts', async () => {
      const response = await apiClient.posts.getPosts({ sort: "popular" });

      const first = response.data?.[0];
      const last = response.data?.[response.data?.length - 1];

      expect(response.success).toBeTruthy();
      expect(response.data).toBeTruthy();
      expect(first?.voteScore).toBeGreaterThan(last!.voteScore);
    });
  });

  describe("incentives for posting / membership updates", () => {
    it("should trigger a member reputation upgrade if the member posts 5 posts, going from level 2 to level 3", async () => {
      const { token, userId } = await createFakeIdToken();
      const level2Member = await setupLevel2Member(apiClient, token, userId, databaseFixture);

      for (let i = 1; i <= 6; i++) {
        const post: Posts.Inputs.CreatePostInput = {
          postType: "link",
          title: `New Test post ${i}`,
          content: `This is an autogenerated test link post ${i}`,
          memberId: level2Member.updatedMember.id,
          link: `http://sample.link-$i}`,
        };

        await apiClient.posts.create(post, token);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const upgradedMember = await databaseFixture.getMemberById(level2Member.updatedMember.id);

      expect(upgradedMember?.reputationLevel).toBe(Types.ReputationLevel.Level3);
    }, 20000);
  });
});
