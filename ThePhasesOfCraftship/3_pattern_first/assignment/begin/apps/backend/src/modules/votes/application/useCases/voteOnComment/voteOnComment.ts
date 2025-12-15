import { ApplicationErrors } from "@dddforum/errors/application";
import { ServerErrors } from "@dddforum/errors/server";
import { Result, success, UseCase, fail } from "@dddforum/core";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";
import { VoteRepository } from "../../../repos/ports/voteRepository";
import { Commands } from "@dddforum/api/votes";
import { EventBus } from "@dddforum/bus";
import { CommentVote } from "../../../domain/commentVote";
import { CanVoteOnCommentPolicy } from "./canVoteOnComment";
import { CommentRepository } from "../../../../comments/repos/ports/commentRepository";

type VoteOnCommentError = ApplicationErrors.ValidationError | ApplicationErrors.PermissionError | ApplicationErrors.NotFoundError | ServerErrors.DatabaseError;

export class VoteOnComment implements UseCase<Commands.VoteOnCommentCommand, Result<CommentVote, VoteOnCommentError>> {
  constructor(
    private memberRepository: MembersRepository,
    private commentRepo: CommentRepository,
    private voteRepository: VoteRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: Commands.VoteOnCommentCommand): Promise<Result<CommentVote, VoteOnCommentError>> {
    const { memberId, commentId, voteType } = request.props;

    const member = await this.memberRepository.getMemberById(memberId);
    if (!member) {
      return fail(new ApplicationErrors.NotFoundError("member"));
    }

    const comment = await this.commentRepo.getCommentById(commentId);
    if (!comment) {
      return fail(new ApplicationErrors.NotFoundError("comment"));
    }

    if (!CanVoteOnCommentPolicy.isAllowed(member, comment)) {
      return fail(new ApplicationErrors.PermissionError(`Permission Error. You need to be atleast a level 2 member to vote on another member's comment `));
    }

    const commentVote = CommentVote.create(memberId, commentId);
    commentVote.castVote(voteType);

    try {
      await this.voteRepository.save(commentVote);
      this.eventBus.publishEvents(commentVote.getDomainEvents());
      return success(commentVote);
    } catch (e) {
      console.log("error casting vote", e);
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
