import { CommentUpvoted } from "../domain/commentUpvoted";
import { CommentDownvoted } from "../domain/commentDownvoted";
import { Commands } from "@dddforum/api/votes";
import { VotesService } from "./votesService";
import { PostDownvoted } from "../domain/postDownvoted";
import { EventBus } from "@dddforum/bus";
import { PostUpvoted } from "../domain/postUpvoted";
import { CommentPosted } from "../../comments/domain/commentPosted";
import { PostCreated } from "../../posts/domain/postCreated";

export class VotesSubscriptions {
  constructor(
    private eventBus: EventBus,
    private voteService: VotesService,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    console.log("Setting up subs");
    this.eventBus.subscribe<PostUpvoted>(PostUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<PostDownvoted>(PostDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentUpvoted>(CommentUpvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<PostCreated>(PostCreated.name, this.onPostCreatedCastInitiaUpvote.bind(this));
    this.eventBus.subscribe<CommentDownvoted>(CommentDownvoted.name, this.onPostOrCommentVoteChanged.bind(this));
    this.eventBus.subscribe<CommentPosted>(CommentPosted.name, this.onCommentPostedCastInitiaUpvote.bind(this));
  }

  async onCommentPostedCastInitiaUpvote(event: CommentPosted) {
    try {
      const { commentId, memberId } = event;
      const command = new Commands.VoteOnCommentCommand({ voteType: "upvote", commentId, memberId });
      await this.voteService.castVoteOnComment(command);
    } catch (e) {
      console.log("Error casting initial vote", e);
    }
  }

  async onPostOrCommentVoteChanged(event: CommentUpvoted | PostUpvoted | CommentDownvoted | CommentUpvoted) {
    try {
      const command = new Commands.UpdateMemberReputationScoreCommand({
        memberId: event.memberId,
      });
      await this.voteService.updateMemberReputationScore(command);
    } catch (error) {
      console.log(error);
      // Handle
    }
  }
  async onPostCreatedCastInitiaUpvote(event: PostCreated) {
    try {
      const { postId, memberId } = event;
      const command = new Commands.VoteOnPostCommand({ voteType: "upvote", postId, memberId });
      await this.voteService.castVoteOnPost(command);
    } catch (e) {
      console.log("Error casting initial vote on post", e);
    }
  }
}
