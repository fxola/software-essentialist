import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { PrismaClient, User } from "@prisma/client";
import { UserRepository } from "../ports/userRepository";
import { generateRandomPassword } from "../../../shared/utils";

export class ProductionUserRepository implements UserRepository {
  constructor(private db: PrismaClient) {}
  save = async (
    user: CreateUserParams,
  ): Promise<User & { password: string }> => {
    const { email, firstName, lastName, username } = user;
    return await this.db.$transaction(async () => {
      const user = await this.db.user.create({
        data: {
          email,
          username,
          firstName,
          lastName,
          password: generateRandomPassword(10),
        },
      });
      await this.db.member.create({
        data: { userId: user.id },
      });

      return user;
    });
  };

  async findUserByEmail(email: string): Promise<User | null> {
    return this.db.user.findFirst({ where: { email } });
  }

  findUserByUsername(username: string): Promise<User | null> {
    return this.db.user.findFirst({ where: { username } });
  }
}
