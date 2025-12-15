import { ServerErrors } from "@dddforum/errors/server";
import { ApplicationErrors } from "@dddforum/errors/application";
import { CanCreatePostPolicy } from "./canCreatePost";
import { Result, success, UseCase, fail } from "@dddforum/core";
import { Post } from "../../../domain/post";
import { PostsRepository } from "../../../repos/ports/postsRepository";
import { MembersRepository } from "../../../../members/repos/ports/membersRepository";
import { Commands } from "@dddforum/api/posts";
import { EventBus } from "@dddforum/bus";

type CreatePostError = ApplicationErrors.ValidationError | ApplicationErrors.PermissionError | ApplicationErrors.NotFoundError | ServerErrors.AnyServerError;

export type CreatePostResponse = Result<Post, CreatePostError>;

export class CreatePost implements UseCase<Commands.CreatePostCommand, CreatePostResponse> {
  constructor(
    private postRepository: PostsRepository,
    private memberRepository: MembersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(request: Commands.CreatePostCommand): Promise<CreatePostResponse> {
    const postProps = request.getProps();

    const foundMember = await this.memberRepository.getMemberById(postProps.memberId);
    if (!foundMember) {
      return fail(new ApplicationErrors.NotFoundError("member"));
    }

    if (!CanCreatePostPolicy.isAllowed(foundMember)) {
      return fail(new ApplicationErrors.PermissionError("Permission Error. You need to be atleast a level 2 member to create a post"));
    }

    const postOrError = Post.create(postProps);

    if (postOrError instanceof ApplicationErrors.ValidationError) {
      return fail(new ApplicationErrors.ValidationError(postOrError.message));
    }

    try {
      await this.postRepository.save(postOrError);
      this.eventBus.publishEvents(postOrError.getDomainEvents());
      return success(postOrError);
    } catch (e) {
      return fail(new ServerErrors.DatabaseError());
    }
  }
}
