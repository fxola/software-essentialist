import { PrismaClient } from "@prisma/client";
import { Post } from "@dddforum/shared/src/api/posts";
import { ProductionUserRepository } from "../../modules/users/adapters/productionUserRepository";
import { UserRepository } from "../../modules/users/ports/userRepository";
import { ProductionPostRepository } from "../../modules/posts/adapters/productionPostsRepository";

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
    this.posts = this.buildPostsRepository();
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

  private buildPostsRepository() {
    return new ProductionPostRepository(this.connection);
  }
}
