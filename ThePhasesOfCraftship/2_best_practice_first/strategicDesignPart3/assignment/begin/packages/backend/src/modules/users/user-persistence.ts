import { PrismaClient } from "@prisma/client";
import { CreateUserDTO } from "./user-dto";
import { generateRandomPassword } from "../../shared/utils";

export class UserPersistence {
  private users;

  constructor(private prisma: PrismaClient) {
    this.users = this.createUserPersistence();
  }

  private createUserPersistence() {
    return {
      save: this.save,
      findByEmail: this.findByEmail,
      findByUsername: this.findByUsername,
    };
  }

  private save = async (newUser: CreateUserDTO) => {
    const userDetails = await this.prisma.$transaction(async () => {
      const user = await this.prisma.user.create({
        data: { ...newUser, password: generateRandomPassword(10) },
      });

      const member = await this.prisma.member.create({
        data: { userId: user.id },
      });
      return { user, member };
    });

    return userDetails;
  };

  private findByEmail = async (email: string) => {
    const foundUser = await this.prisma.user.findUnique({
      where: { email },
    });
    return foundUser;
  };

  private findByUsername = async (username: string) => {
    const foundUser = await this.prisma.user.findFirst({
      where: { username },
    });
    return foundUser;
  };

  public getUserPersistence() {
    return this.users;
  }
}
