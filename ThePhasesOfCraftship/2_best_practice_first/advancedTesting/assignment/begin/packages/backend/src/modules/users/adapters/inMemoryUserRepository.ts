import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { User } from "@prisma/client";
import { UserRepository } from "../ports/userRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  save(user: CreateUserParams): Promise<User & { password: string }> {
    const id = this.users.length === 0 ? 1 : this.users.length + 1;
    const savedUser = { ...user, id, password: `${id}-password` };
    this.users.push(savedUser);
    return Promise.resolve(savedUser);
  }

  findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }

  findUserByUsername(username: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }
}
