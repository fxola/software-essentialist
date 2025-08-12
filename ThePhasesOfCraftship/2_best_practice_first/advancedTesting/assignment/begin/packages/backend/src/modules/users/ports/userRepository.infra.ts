import { PrismaClient } from "@prisma/client";
import { ProductionUserRepository } from "../adapters/productionUserRepository";
import { UserRepository } from "./userRepository";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";

describe("User repository", () => {
  const db = new PrismaClient();
  const userRepos: UserRepository[] = [new ProductionUserRepository(db)];

  it("should save and fetch users by email successfully", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();

    for (const repo of userRepos) {
      const savedUser = await repo.save(user);
      const fetchedUser = await repo.findUserByEmail(user.email);

      expect(savedUser).toBeDefined();
      expect(fetchedUser).toBeDefined();
      expect(savedUser.email).toBe(fetchedUser?.email);

      expect(savedUser.firstName).toBe(fetchedUser?.firstName);
      expect(savedUser.lastName).toBe(fetchedUser?.lastName);
      expect(savedUser.username).toBe(fetchedUser?.username);
    }
  });

  it("should save and fetch users by username successfully", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();

    for (const repo of userRepos) {
      const savedUser = await repo.save(user);
      const fetchedUser = await repo.findUserByUsername(user.username);

      expect(savedUser).toBeDefined();
      expect(fetchedUser).toBeDefined();
      expect(savedUser.username).toBe(fetchedUser?.username);

      expect(savedUser.firstName).toBe(fetchedUser?.firstName);
      expect(savedUser.lastName).toBe(fetchedUser?.lastName);
      expect(savedUser.email).toBe(fetchedUser?.email);
    }
  });
});
