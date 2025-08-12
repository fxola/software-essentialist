import { PrismaClient } from "@prisma/client";
import { User } from "@dddforum/shared/src/api/users";
import { Post } from "@dddforum/shared/src/api/posts";
import { ServerErrorException } from "../exceptions";
import { CreateUserCommand } from "../../modules/users/usersCommand";
import { ProductionUserRepository } from "../../modules/users/adapters/productionUserRepository";
import { UserRepository } from "../../modules/users/ports/userRepository";

export interface PostsPersistence {
  findPosts(sort: string): Promise<Post[]>;
}

export class Database {
  public users: UserRepository;
  public posts: PostsPersistence;
  private connection: PrismaClient;

  constructor() {
    this.connection = new PrismaClient();
    this.users = this.buildUsersRepository();
    this.posts = this.buildPostsPersistence();
  }

  getConnection() {
    return this.connection;
  }

  async connect() {
    await this.connection.$connect();
  }

  private buildUsersRepository() {
    return new ProductionUserRepository(this.connection);
  }

  private buildPostsPersistence(): PostsPersistence {
    return {
      findPosts: this.findPosts.bind(this),
    };
  }

  private async findPosts(_: string): Promise<Post[]> {
    try {
      const posts = await this.connection.post.findMany({
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
