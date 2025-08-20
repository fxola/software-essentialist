import { PrismaClient, User } from "@prisma/client";
import { ProductionUserRepository } from "../adapters/productionUserRepository";
import { UserRepository } from "./userRepository";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { InMemoryUserRepositorySpy } from "../adapters/inMemoryUserRepositorySpy";
import { DatabaseFixture } from "@dddforum/shared/tests/support/fixtures/databaseFixture";

describe("User repository", () => {
  const db = new PrismaClient();
  const databaseFixture = new DatabaseFixture();

  const inMemoryUserRepo = new InMemoryUserRepositorySpy();
  const productionUserRepo = new ProductionUserRepository(db);

  const userRepos: UserRepository[] = [productionUserRepo, inMemoryUserRepo];

  beforeEach(async () => {
    await databaseFixture.resetDatabase();
    inMemoryUserRepo.reset();
  });

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

  it("should save and fetch all users", async () => {
    let savedUsers: User[] = [];
    let allUsers: User[] = [];

    const user1 = new CreateUserBuilder().withAllRandomDetails().build();
    const user2 = new CreateUserBuilder().withAllRandomDetails().build();

    for (let repo of userRepos) {
      savedUsers.push(await repo.save(user1));
      savedUsers.push(await repo.save(user2));

      allUsers = await repo.getAllUsers();

      expect(allUsers.length).toBe(savedUsers.length);
      expect(allUsers[0].email).toBe(savedUsers[0].email);
      expect(allUsers[0].username).toBe(savedUsers[0].username);
      expect(allUsers[1].email).toBe(savedUsers[1].email);
      expect(allUsers[1].username).toBe(savedUsers[1].username);

      savedUsers = []; //reset
    }
  });

  it("should fail to fetch user by email when provided with an unregistered email", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();

    for (const repo of userRepos) {
      await repo.save(user);

      const foundUser = await repo.findUserByEmail("new@email.com");
      expect(foundUser).toBe(null);
    }
  });

  it("should fail to fetch user by username when provided with an unregistered username", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();

    for (const repo of userRepos) {
      await repo.save(user);

      const foundUser = await repo.findUserByUsername("utdfave");
      expect(foundUser).toBe(null);
    }
  });
});
