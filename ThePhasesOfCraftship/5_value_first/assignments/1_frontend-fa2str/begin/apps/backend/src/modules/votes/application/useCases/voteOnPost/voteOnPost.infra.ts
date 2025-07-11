
import { ProductionMembersRepository } from "../../../../members/repos/adapters/productionMembersRepository";
import { VoteOnPost } from "./voteOnPost";
import { ProductionPostsRepository } from "../../../../posts/repos/adapters/productionPostsRepository";
import { ProductionVotesRepository } from "../../../repos/adapters/productionVotesRepo";
import { PostVote } from "../../../../posts/domain/postVote";
import { Member } from "../../../../members/domain/member";
import { Post } from "../../../../posts/domain/post";
import { randomUUID } from "crypto";
import { TextUtil } from "@dddforum/core";
import { EventOutboxTable } from "@dddforum/outbox";
import { PostUpvoted } from "../../../../posts/domain/postUpvoted";
import { PostDownvoted } from "../../../../posts/domain/postDownvoted";
import { PrismaDatabase } from "@dddforum/database";
import * as Votes from "@dddforum/api/votes"
import { Config } from "@dddforum/config";

describe('voteOnPost', () => {

  let config = Config();
  const database = new PrismaDatabase(config);
  const eventsTable = new EventOutboxTable(database);
  const memberRepository = new ProductionMembersRepository(database, eventsTable);
  const postRepository = new ProductionPostsRepository(database, eventsTable);
  const voteRepository = new ProductionVotesRepository(database, eventsTable);
  const useCase = new VoteOnPost(memberRepository, postRepository, voteRepository);

  async function setupTest () {
    const originalPostOwner = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      username: `billybob-${TextUtil.createRandomText(5)}`,
      reputationScore: 25,
      reputationLevel: 'Level2',
      dateCreated: new Date(),
      lastUpdated: new Date()
    })

    const member = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      username: `jill-${TextUtil.createRandomText(5)}`,
      reputationScore: 21,
      reputationLevel: 'Level2',
      dateCreated: new Date(),
      lastUpdated: new Date()
    })

    const post = Post.toDomain({
      id: randomUUID(),
      title: 'test',
      content: 'This is a post that we are using for testing! Posted by billybob',
      memberId: originalPostOwner.id,
      dateCreated: new Date(),
      lastUpdated: new Date(),
      voteScore: 10,
      postType: 'text',
      link: null,
      slug: 'test-post'
    });


    await memberRepository.save(originalPostOwner);
    await memberRepository.save(member);
    await postRepository.save(post)

    return { member, post };
  }

  it('should be able to cast an upvote', async () => {
    const { member, post } = await setupTest()

    const command = new Votes.Commands.VoteOnPostCommand({ 
      memberId: member.id, 
      postId: post.id, 
      voteType: 'upvote' 
    });
    const result = await useCase.execute(command);

    expect(result.isSuccess()).toBe(true);
    if (!result.isSuccess()) return;

    const postVote = result.getValue();
    expect(postVote).toBeInstanceOf(PostVote);
    expect(postVote.memberId).toBe(member.id);
    expect(postVote.postId).toBe(post.id);

    // Domain event saved
    const aggregateId = postVote.id;
    const eventsFromTable = await eventsTable.getEventsByAggregateId(aggregateId);
    expect(eventsFromTable.length).toBe(1);
    expect(eventsFromTable[0].name).toBe('PostUpvoted');

    const event = eventsFromTable[0] as PostUpvoted;
    expect(event.aggregateId).toBe(aggregateId);
    expect(event.data.postVoteId).toBe(aggregateId);
    expect(event.data.postId).toBe(post.id);
    expect(event.data.memberId).toBe(member.id);
  });

  it('should be able to cast an downvote', async () => {
    const { member, post } = await setupTest()

    const command = new Votes.Commands.VoteOnPostCommand({ 
      memberId: member.id, 
      postId: post.id, 
      voteType: 'downvote' 
    });
    const result = await useCase.execute(command);

    expect(result.isSuccess()).toBe(true);
    if (!result.isSuccess()) return;

    const postVote = result.getValue();
    expect(postVote).toBeInstanceOf(PostVote);
    expect(postVote.memberId).toBe(member.id);
    expect(postVote.postId).toBe(post.id);

    // Domain event saved
    const aggregateId = postVote.id;
    const eventsFromTable = await eventsTable.getEventsByAggregateId(aggregateId);
    expect(eventsFromTable.length).toBe(1);
    expect(eventsFromTable[0].name).toBe('PostDownvoted');

    const event = eventsFromTable[0] as PostDownvoted;
    expect(event.aggregateId).toBe(aggregateId);
    expect(event.data.postVoteId).toBe(aggregateId);
    expect(event.data.postId).toBe(post.id);
    expect(event.data.memberId).toBe(member.id);
  });
})
