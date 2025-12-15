import { PostComment } from "./postComment";
import { ProductionPostsRepository } from "../../../../posts/repos/adapters/productionPostsRepository";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";
import { InMemoryEventBus } from "@dddforum/bus";
import { Commands } from "@dddforum/api/comments";
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { ProductionCommentsRepository } from "../../../repos/adapters/productionCommentRepository";
import { setupTestWithLevel1Member } from "../../../../../../tests/fixtures/unit/members";
import { CommentPosted } from "../../../domain/commentPosted";
import { withExistingPostByRandomMember } from "../../../../../../tests/fixtures/unit/posts";
import { Comment } from "../../../domain/comment";
import { randomUUID } from "crypto";
import { TextUtil } from "@dddforum/core";

describe("postComment", () => {
  let config = Config();
  let database = new PrismaDatabase(config);
  let commentsRepo = new ProductionCommentsRepository(database);
  let postsRepo = new ProductionPostsRepository(database);
  let membersRepo = new ProductionMembersRepository(database);
  let eventBus = new InMemoryEventBus();
  const useCase = new PostComment(commentsRepo, postsRepo, membersRepo, eventBus);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("permissions & identity", () => {
    test("as a level 1 member, I should be able to post a comment", async () => {
      const addCommentEventSpy = jest.spyOn(eventBus, "publishEvents");
      const saveSpy = jest.spyOn(commentsRepo, "save").mockImplementation(async () => {});

      const level1Member = setupTestWithLevel1Member(useCase);
      const existingPost = withExistingPostByRandomMember(useCase);

      const commandOrError = Commands.PostCommentCommand.create({ postId: existingPost.id, text: "comment test", memberId: level1Member.id });
      const result = await useCase.execute(commandOrError.getValue());

      expect(result.isSuccess()).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Comment);
      expect(saveSpy).toHaveBeenCalled();
      expect(addCommentEventSpy).toHaveBeenCalled();
      expect(addCommentEventSpy).toHaveBeenCalledTimes(1);

      const commentPostedEvent = addCommentEventSpy.mock.calls[0][0][0] as CommentPosted;

      expect(addCommentEventSpy).toHaveBeenCalledWith([commentPostedEvent]);
      expect(commentPostedEvent.name).toBe("CommentPosted");
      expect(commentPostedEvent.commentId).toBe(result.getValue().id);
      expect(commentPostedEvent.postId).toBe(existingPost.id);
      expect(commentPostedEvent.memberId).toBe(level1Member.id);
    });
  });

  describe("posting comments", () => {
    test("if the member does not exist, the comment should not be created", async () => {
      const addCommentEventSpy = jest.spyOn(eventBus, "publishEvents");
      const saveSpy = jest.spyOn(commentsRepo, "save").mockImplementation(async () => {});

      const existingPost = withExistingPostByRandomMember(useCase);

      const commandOrError = Commands.PostCommentCommand.create({ postId: existingPost.id, text: "comment test", memberId: "" });

      expect(commandOrError.isFailure()).toBe(true);
      expect(commandOrError.getError().type).toBe("ValidationError");
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(addCommentEventSpy).toHaveBeenCalledTimes(0);
    });

    test("if the post was not found, the comment should not be created", async () => {
      const addCommentEventSpy = jest.spyOn(eventBus, "publishEvents");
      const saveSpy = jest.spyOn(commentsRepo, "save").mockImplementation(async () => {});

      const level1Member = setupTestWithLevel1Member(useCase);

      const commandOrError = Commands.PostCommentCommand.create({ postId: randomUUID(), text: "comment test", memberId: level1Member.id });
      const result = await useCase.execute(commandOrError.getValue());

      expect(result.isFailure()).toBe(true);
      expect(result.getError().type).toBe("NotFoundError");
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(addCommentEventSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("comment validation", () => {
    test("should not allow empty comments", async () => {
      const addCommentEventSpy = jest.spyOn(eventBus, "publishEvents");
      const saveSpy = jest.spyOn(commentsRepo, "save").mockImplementation(async () => {});

      const level1Member = setupTestWithLevel1Member(useCase);

      const commandOrError = Commands.PostCommentCommand.create({ postId: randomUUID(), text: "", memberId: level1Member.id });

      expect(commandOrError.isFailure()).toBe(true);
      expect(commandOrError.getError().type).toBe("ValidationError");
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(addCommentEventSpy).toHaveBeenCalledTimes(0);
    });

    test("should not allow comments exceeding 1000 characters", async () => {
      const addCommentEventSpy = jest.spyOn(eventBus, "publishEvents");
      const saveSpy = jest.spyOn(commentsRepo, "save").mockImplementation(async () => {});

      const level1Member = setupTestWithLevel1Member(useCase);

      const commandOrError = Commands.PostCommentCommand.create({ postId: randomUUID(), text: TextUtil.createRandomText(1500), memberId: level1Member.id });

      expect(commandOrError.isFailure()).toBe(true);
      expect(commandOrError.getError().type).toBe("ValidationError");
      expect(saveSpy).toHaveBeenCalledTimes(0);
      expect(addCommentEventSpy).toHaveBeenCalledTimes(0);
    });
  });
});
