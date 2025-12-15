import { Result, UseCase, success, fail } from "@dddforum/core";
import { CommentRepository } from "../../../repos/ports/commentRepository";
import { Comment } from "../../../domain/comment";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Comments } from "@dddforum/api";
import { PostsRepository } from "../../../../posts/repos/ports/postsRepository";
import { CanPostCommentPolicy } from "./canPostComment";
import { EventBus } from "@dddforum/bus";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";
import { ServerErrors } from "@dddforum/errors/server";

export type PostCommentError = ApplicationErrors.ValidationError | ApplicationErrors.PermissionError | ApplicationErrors.NotFoundError;

export class PostComment implements UseCase<Comments.Commands.PostCommentCommand, Result<Comment, PostCommentError>> {
  constructor(
    private commentRepo: CommentRepository,
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: Comments.Commands.PostCommentCommand): Promise<Result<Comment, PostCommentError>> {
    const { postId, memberId } = command.props;

    const foundMember = await this.memberRepository.getMemberById(memberId);
    if (!foundMember) {
      return fail(new ApplicationErrors.NotFoundError("member"));
    }

    if (!CanPostCommentPolicy.isAllowed(foundMember)) {
      return fail(new ApplicationErrors.PermissionError("Comment not allowed"));
    }

    const foundPost = await this.postRepository.getPostById(postId);
    if (!foundPost) {
      return fail(new ApplicationErrors.NotFoundError("post"));
    }

    const commentOrError = Comment.create(command.props);
    if (commentOrError instanceof ApplicationErrors.ValidationError) {
      return fail(new ApplicationErrors.ValidationError(commentOrError.message));
    }

    try {
      await this.commentRepo.save(commentOrError);
      this.eventBus.publishEvents(commentOrError.getDomainEvents());
      return success(commentOrError);
    } catch (e) {
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
