
import { APIClient } from "@dddforum/api";
import { makeAutoObservable } from "mobx";
import { PostDm } from "../domain/postDm";
import { PostsRepository } from "./postsRepository";
import { Posts } from "@dddforum/api"
import { AuthStore } from "@/modules/auth/authStore";

export class PostsStore implements PostsRepository {
  public postsDm: PostDm[];

  constructor(
    private api: APIClient,
    private authStore: AuthStore
  ) {
    makeAutoObservable(this);
    this.postsDm = [];
  }

  async getPostBySlug(slug: string): Promise<PostDm | null> {
    const response = await this.api.posts.getPostBySlug(slug);
    if (response.success && response.data) {
      return PostDm.fromDTO(response.data);
    }
    return null;
  } 

  async getPosts(query?: Posts.Queries.GetPostsQuery): Promise<PostDm[]> {
    const getPostsResponse = await this.api.posts.getPosts({ sort: query?.sort ?? 'popular' });
    const postDTOs = getPostsResponse.data;
    if (!postDTOs) {
      return [];
    }
    this.postsDm = postDTOs.map(postDTO => PostDm.fromDTO(postDTO));
    return this.postsDm;
  }

  async create(input: Posts.Inputs.CreatePostInput): Promise<PostDm> {
    const authToken = this.authStore.getToken() ?? '';
    const response = await this.api.posts.create(input, authToken);
    if (!response.data) {
      throw new Error('Failed to create post');
    }
    const newPost = PostDm.fromDTO(response.data);
    this.postsDm.push(newPost);
    return newPost;
  }
}
