import { PrismaClient } from "@prisma/client";
import { UserPersistence } from "../../modules/users/user-persistence";
import { PostPersistence } from "../../modules/posts/post-persistence";

export class Database {
  public users;
  public posts;
  public instance: PrismaClient;

  constructor() {
    const db = new PrismaClient();
    this.instance = db;
    this.users = new UserPersistence(db).getUserPersistence();
    this.posts = new PostPersistence(db).getPersistence();
  }
}
