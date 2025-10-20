import { generateRandomPassword } from "@dddforum/backend/src/shared/utils";
import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { PrismaClient } from "@prisma/client";

export class DatabaseOperation {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  seedUsers = async (users: CreateUserInput[]) => {
    try {
      await this.prisma.$transaction(async (tx) => {
        await Promise.all(
          users.map(async (userData) => {
            const user = await this.prisma.user.create({
              data: { ...userData, password: generateRandomPassword(10) },
            });

            return user;
          })
        );
      });
    } catch (e) {
      console.log("Failed to seed users", e);
    } finally {
      await this.prisma.$disconnect();
    }
  };

  resetDatabase = async () => {
    const deleteAllComments = this.prisma.comment.deleteMany();
    const deleteAllVotes = this.prisma.vote.deleteMany();
    const deleteAllPosts = this.prisma.post.deleteMany();
    const deleteMembers = this.prisma.member.deleteMany();
    const deleteAllUsers = this.prisma.user.deleteMany();

    try {
      await this.prisma.$transaction([
        deleteAllComments,
        deleteAllVotes,
        deleteAllPosts,
        deleteMembers,
        deleteAllUsers,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      await this.prisma.$disconnect();
    }
  };
}
