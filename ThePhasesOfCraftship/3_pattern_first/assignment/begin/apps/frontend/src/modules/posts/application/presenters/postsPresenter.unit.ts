import { PostsPresenter } from "./postsPresenter";
import { fakePostsData } from "../../__tests__/fakePostsData";
import { SearchFilterViewModel } from "../viewModels/searchFilterViewModel";
import { createAPIClient } from "@dddforum/api";
import { AuthStore } from "@/modules/auth/stores/authStore";
import { setupAuthStoreWithMember } from "@/shared/testUtils";
import { PostViewModel } from "../viewModels/postViewModel";
import { FakePostsStore } from "../../stores/fakePostsStore";
import { MemberDm } from "@/modules/auth/domain/memberDm";
import { randomUUID } from "crypto";

describe("PostsPresenter", () => {
  const stubbedAPI = createAPIClient("");
  let loadedPostsVm: PostViewModel[] = [];

  let postsStore = new FakePostsStore(fakePostsData);
  let authStore: AuthStore;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    authStore = new AuthStore(stubbedAPI);
  });

  it("can render a list of posts", async () => {
    const postsPresenter = new PostsPresenter(postsStore, authStore);

    await postsPresenter.load((recentPosts) => {
      loadedPostsVm = recentPosts;
    });

    expect(loadedPostsVm.length).toBe(fakePostsData.length);
    expect(loadedPostsVm[0].canCastVote).toBe(false);
    expect(loadedPostsVm[0].title).toBe(fakePostsData[0].title);
    expect(loadedPostsVm[0].content).toBe(fakePostsData[0].content);
    expect(loadedPostsVm[0].voteScore).toBe(fakePostsData[0].voteScore);
    expect(loadedPostsVm[0].dateCreated).toBe(fakePostsData[0].dateCreated);
  });

  it("can switch between popular posts and new posts", async () => {
    const postsPresenter = new PostsPresenter(postsStore, authStore);
    let activeFilter: SearchFilterViewModel = new SearchFilterViewModel("popular");

    await postsPresenter.load((recentPosts, recentFilter) => {
      loadedPostsVm = recentPosts;
      activeFilter = recentFilter;
    });

    expect(activeFilter.value).toBe("popular");
    expect(loadedPostsVm.length).toBe(fakePostsData.length);
    expect(loadedPostsVm[0].voteScore).toBeGreaterThan(loadedPostsVm[2].voteScore);

    postsPresenter.switchSearchFilter("recent");

    await postsPresenter.load((recentPosts, recentFilter) => {
      loadedPostsVm = recentPosts;
      activeFilter = recentFilter;
    });

    expect(activeFilter.value).toBe("recent");
    expect(loadedPostsVm.length).toBe(fakePostsData.length);
    expect(new Date(loadedPostsVm[0].dateCreated).getTime()).toBeGreaterThan(new Date(loadedPostsVm[2].dateCreated).getTime());
  });

  it("does not let level 1 users cast votes", async () => {
    const postsPresenter = new PostsPresenter(postsStore, authStore);

    await postsPresenter.load((recentPosts) => {
      loadedPostsVm = recentPosts;
    });

    expect(loadedPostsVm[0].canCastVote).toBe(false);
    expect(loadedPostsVm[1].canCastVote).toBe(false);
    expect(loadedPostsVm[2].canCastVote).toBe(false);
  });

  it("does let level 2 users cast votes", async () => {
    const Level2Member = new MemberDm({
      reputationLevel: "Level2",
      userId: randomUUID(),
      username: "Jonny",
      id: randomUUID(),
      email: "jon@doe.com",
    });

    const currentMemberSpy = jest.spyOn(authStore, "getCurrentMember");
    currentMemberSpy.mockImplementation(() => Level2Member);

    const postsPresenter = new PostsPresenter(postsStore, authStore);

    await postsPresenter.load((recentPosts) => {
      loadedPostsVm = recentPosts;
    });

    expect(loadedPostsVm[0].canCastVote).toBe(true);
    expect(loadedPostsVm[1].canCastVote).toBe(true);
    expect(loadedPostsVm[2].canCastVote).toBe(true);
  });
});
