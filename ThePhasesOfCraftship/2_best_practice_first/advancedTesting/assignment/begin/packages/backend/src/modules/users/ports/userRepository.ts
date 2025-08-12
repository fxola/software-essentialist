import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { User } from "@prisma/client";

export interface UserRepository {
  save(user: CreateUserParams): Promise<User & { password: string }>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
}
