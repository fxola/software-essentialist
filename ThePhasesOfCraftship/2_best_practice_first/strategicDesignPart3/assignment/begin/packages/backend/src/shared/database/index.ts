import { PrismaClient } from "@prisma/client";
import { UserPersistence } from "../../modules/users/user-persistence";

export class Database {
  public users;

  constructor(db: PrismaClient) {
    this.users = new UserPersistence(db).getUserPersistence();
  }
}
