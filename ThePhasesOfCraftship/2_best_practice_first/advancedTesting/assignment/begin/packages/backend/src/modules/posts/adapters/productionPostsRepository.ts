import { Post } from "@dddforum/shared/src/api/posts";
import { PostsRepository } from "../ports/postsRepository";
import { PrismaClient } from "@prisma/client";
import { ServerErrorException } from "../../../shared/exceptions";

export class ProductionPostRepository implements PostsRepository {
  constructor(private db: PrismaClient) {}
  async findPosts(sort: string): Promise<Post[]> {
    try {
      const posts = await this.db.post.findMany({
        orderBy: { dateCreated: "desc" },
      });
      const formattedPosts = posts.map(this.formatPost);

      return formattedPosts;
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  private formatPost(post: any): Post {
    return {
      id: post.id,
      memberId: post.memberId,
      postType: post.postType,
      title: post.title,
      content: post.content,
      dateCreated: post.dateCreated.toISOString(),
    };
  }
}
