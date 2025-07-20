import { Database } from "../../shared/database";
import { GetPostDTO } from "./post-dto";

export class PostService {
  constructor(private db: Database) {}

  getPosts = async (dto: GetPostDTO) => {
    const { sort } = dto;

    const posts = await this.db.posts.getRecentPosts();

    return posts;
  };
}
