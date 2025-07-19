import { generateRandomPassword } from "@dddforum/backend/src";
import { prisma } from "@dddforum/backend/src/database";
import { CreateUserInput } from "@dddforum/shared/src/api/users";

export const seedUsers = async (users: CreateUserInput[]) => {
  try {
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        users.map(async (userData) => {
          const user = await prisma.user.create({
            data: { ...userData, password: generateRandomPassword(10) },
          });

          return user;
        })
      );
    });
  } catch (e) {
    console.log("Failed to seed users", e);
  } finally {
    await prisma.$disconnect();
  }
};
