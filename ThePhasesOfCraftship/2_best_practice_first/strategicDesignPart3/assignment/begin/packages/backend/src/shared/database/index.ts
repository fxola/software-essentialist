import { PrismaClient } from "@prisma/client";
import { UserPersistence } from "../../modules/users/user-persistence";
import { PostPersistence } from "../../modules/posts/post-persistence";

export class Database {
  public users;
  public posts;

  constructor(db: PrismaClient) {
    this.users = new UserPersistence(db).getUserPersistence();
    this.posts = new PostPersistence(db).getPersistence();
  }
}
