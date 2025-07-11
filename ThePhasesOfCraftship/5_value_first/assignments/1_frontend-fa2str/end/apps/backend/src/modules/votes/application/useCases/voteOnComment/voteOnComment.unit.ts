import { PrismaClient } from "@prisma/client";
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { VoteOnComment } from "./voteOnComment";
import { ApplicationErrors } from "@dddforum/errors/application";
import { Member, MemberReputationLevel } from "../../../../members/domain/member";
import { MemberUsername } from "../../../../members/domain/memberUsername";
import { VoteState } from "../../../../posts/domain/postVote";
import { ProductionCommentsRepository } from "../../../../comments/repos/adapters/productionCommentRepository";
import { ProductionVotesRepository } from "../../../repos/adapters/productionVotesRepo";
import { Comment } from "../../../../comments/domain/comment";
import { CommentVote } from "../../../../comments/domain/commentVote";
import { Commands } from '@dddforum/api/votes'
import { EventOutboxTable } from "@dddforum/outbox";
import { PrismaDatabase } from "@dddforum/database";
import { Config } from "@dddforum/config";

let config = Config();
let database = new PrismaDatabase(config);
let outboxTable = new EventOutboxTable(database);
let membersRepo = new ProductionMembersRepository(database, outboxTable);
let commentsRepo = new ProductionCommentsRepository(database);
let eventsTable = new EventOutboxTable(database);
let votesRepo = new ProductionVotesRepository(database, eventsTable);

const useCase = new VoteOnComment(membersRepo, commentsRepo, votesRepo);

function setupCommentAndMember (useCase: VoteOnComment, memberReputationLevel: 'Level1' | 'Level2' | 'Level3') {
  jest.resetAllMocks();

  let member = Member.toDomain({
    userId: '8be25ac7-49ff-43be-9f22-3811e268e0bd',
    username: MemberUsername.toDomain('jill'),
    reputationScore: 10,
    reputationLevel: memberReputationLevel,
    id: 'bf6b4773-feea-44cd-a951-f0ffd68625ea'
  });

  let comment = Comment.toDomain({
    id: '83f91fd3-3e54-4d55-aa92-9027abd5310e',
    text: 'This is a comment',
    memberId: member.id,
    parentCommentId: null,
    postId: '2e348513-b2d7-449a-aed4-7b0050261e3e'
  });

  useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(member);
  useCase['commentRepository'].getCommentById = jest.fn().mockResolvedValue(comment);
  
  return {member, comment};
}

function setupCommentVote (member: Member, comment: Comment, state: VoteState) {
  let commentVote = CommentVote.toDomain({
    id: '6f2a5a6e-7f0f-4f3d-8c8b-9c0c6e2c2f8e',
    commentId: comment.id,
    memberId: member.id,
    voteState: state
  });

  useCase['voteRepository'].findVoteByMemberAndCommentId = jest.fn().mockResolvedValue(commentVote);
}

describe('voteOnComment', () => {

  describe('permissions & identity', () => {
    test('if the member was not found, they should not be able to vote on the comment', async () => {
      useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue(null);
      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: 'non-existent-id',
        memberId: 'non-existent-id',
        voteType: 'upvote'
      });
      
      const result = await useCase.execute(command);
      
      expect(result.isSuccess()).toBe(false);
      if (result.isFailure()) {
        expect(result.getError().type === 'NotFoundError').toBeTruthy();
      }
      expect(saveSpy).not.toHaveBeenCalled(); 
    });

    test('if the comment was not found, they should not be able to vote on the comment', async () => {
      useCase['commentRepository'].getCommentById = jest.fn().mockResolvedValue(null);
      useCase['memberRepository'].getMemberById = jest.fn().mockResolvedValue({});

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: 'non-existent-id',
        memberId: 'non-existent-id',
        voteType: 'upvote'
      });
      
      const result = await useCase.execute(command);
      
      expect(result.isSuccess()).toBe(false);
      if (result.isFailure()) {
        expect(result.getError().type === 'NotFoundError').toBeTruthy();
      }
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it.each([
      ['Level1' as const, false],
      ['Level2' as const, true]
    ])('as a %s member, I can cast a vote on a comment', async (reputationLevel, success) => {
      const { member } = setupCommentAndMember(useCase, reputationLevel);

      const command = new Commands.VoteOnCommentCommand({
        commentId: 'existing-comment-id',
        memberId: member.id,
        voteType: 'upvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(success);
    });
  });

  describe ('vote state', () => {
    test('as a level 2 member, when I upvote a comment I have not yet upvoted, the comment should be upvoted and an upvoted event should get dispatched', async () => {
      const {member, comment} = setupCommentAndMember(useCase, 'Level2');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'upvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        const commentVote = result.getValue();
        expect(commentVote.getValue()).toEqual(1);
        expect(commentVote.getDomainEvents()).toHaveLength(1);
        expect(commentVote.getDomainEvents()[0].name).toEqual('CommentUpvoted');
      }
      expect(saveSpy).toHaveBeenCalled();
    });

    test('as a level 2 member, when I downvote a comment I have not yet downvoted, the comment should be downvoted and a downvoted event should get dispatched', async () => {
      const {member, comment} = setupCommentAndMember(useCase, 'Level2');
      setupCommentVote(member, comment, 'Default');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'downvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        const commentVote = result.getValue();
        expect(commentVote.getValue()).toEqual(-1);
        expect(commentVote.getDomainEvents()).toHaveLength(1);
        expect(commentVote.getDomainEvents()[0].name).toEqual('CommentDownvoted');
      }
      expect(saveSpy).toHaveBeenCalled();
    });

    test('as a level 2 member, when I upvote a comment I have already upvoted, the comment should remain upvoted and no upvoted event should get dispatched', async () => {
      const {member, comment} = setupCommentAndMember(useCase, 'Level2');
      setupCommentVote(member, comment, 'Upvoted');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'upvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        const commentVote = result.getValue();
        expect(commentVote.getValue()).toEqual(1);
        expect(commentVote.getDomainEvents()).toHaveLength(0);
      }
      expect(saveSpy).toHaveBeenCalled();
    });

    test('as a level 2 member, when I downvote a comment I have already downvoted, the comment should remain downvoted', async () => {
      const {member, comment} = setupCommentAndMember(useCase, 'Level2');
      setupCommentVote(member, comment, 'Downvoted');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'downvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      if (result.isSuccess()) {
        const commentVote = result.getValue();
        expect(commentVote.getValue()).toEqual(-1);
      }
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe ('many existing comments vote score', () => {

    test('upvote existing: as a level 2 member, when I upvote a comment with existing votes that I have not yet upvoted, the comment score should get incremented', async () => {
      const {member, comment} = setupCommentAndMember(useCase, 'Level2');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'upvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      expect(saveSpy).toHaveBeenCalled();
    });

    test('downvote existing: as a level 2 member, when I downvote a comment with existing votes that I have not yet downvoted, the comment score should get decremented', async () => {
      const {member, comment } = setupCommentAndMember(useCase, 'Level2');

      const saveSpy = jest.spyOn(useCase['voteRepository'], 'saveAggregateAndEvents');

      const command = new Commands.VoteOnCommentCommand({
        commentId: comment.id,
        memberId: member.id,
        voteType: 'downvote'
      });

      const result = await useCase.execute(command);

      expect(result).toBeDefined();
      expect(result.isSuccess()).toBe(true);
      expect(saveSpy).toHaveBeenCalled();
    });

  });
  
})
