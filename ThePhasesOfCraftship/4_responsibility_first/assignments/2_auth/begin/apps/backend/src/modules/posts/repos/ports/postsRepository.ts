import { ServerErrors } from "@dddforum/errors/server";
import { PostReadModel } from "../../domain/postReadModel";
import { Post } from "../../domain/post";
import { Queries } from "@dddforum/api/posts"
import { DomainEvent } from "@dddforum/core";

export interface PostsRepository {
  findPosts(query: Queries.GetPostsQuery): Promise<PostReadModel[]>;
  save (post: Post): Promise<void | ServerErrors.DatabaseError>;
  getPostById (id: string): Promise<Post | null>;
  getPostDetailsById (id: string): Promise<PostReadModel | null>;
  getPostBySlug(slug: string): Promise<PostReadModel | null>;
  saveAggregateAndEvents(post: Post, events: DomainEvent[]): Promise<void>;
}
