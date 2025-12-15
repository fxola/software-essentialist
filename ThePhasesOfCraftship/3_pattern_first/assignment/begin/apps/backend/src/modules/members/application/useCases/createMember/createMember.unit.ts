import { Member } from "../../../domain/member";
import { CreateMember } from "./createMember";
import { ProductionMembersRepository } from "../../../repos/adapters/productionMembersRepository";
import { PrismaDatabase } from "@dddforum/database";
import { Commands } from "@dddforum/api/members";
import { Config } from "@dddforum/config";
import * as Users from "@dddforum/api/users";
import { InMemoryEventBus } from "@dddforum/bus";
import { randomUUID } from "crypto";

describe("createMember", () => {
  let config = Config();
  let database = new PrismaDatabase(config);
  let membersRepo = new ProductionMembersRepository(database);
  let eventBus = new InMemoryEventBus();
  const useCase = new CreateMember(membersRepo, eventBus);

  const mockToken: Users.Types.DecodedIdToken = {
    email: "test@example.com",
    uid: "auth0|123",
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should create a member when username is available and data is valid", async () => {
    const saveSpy = jest.spyOn(membersRepo, "save").mockImplementation(async () => {});

    const commandOrError = Commands.CreateMemberCommand.create(mockToken, {
      username: "brotherly",
    });

    const result = await useCase.execute(commandOrError.getValue());

    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toBeInstanceOf(Member);
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });

  test("should fail if username is already taken", async () => {
    const saveSpy = jest.spyOn(membersRepo, "save").mockImplementation(async () => {});
    const findByUsernameSpy = jest.spyOn(membersRepo, "findUserByUsername");

    const username = "brotherly";
    const existingMember = Member.toDomain({
      id: randomUUID(),
      userId: randomUUID(),
      reputationLevel: "Level1",
      reputationScore: 0,
      username,
      dateCreated: new Date(),
      lastUpdated: new Date(),
    });
    findByUsernameSpy.mockResolvedValue(existingMember);

    const commandOrError = Commands.CreateMemberCommand.create(mockToken, { username });
    const result = await useCase.execute(commandOrError.getValue());

    expect(result.isFailure()).toBe(true);
    expect(result.getError().type).toBe("ConfictError");
    expect(result.getError().message).toContain("member");
    expect(saveSpy).toHaveBeenCalledTimes(0);
  });

  test("should fail if validation fails", async () => {
    const saveSpy = jest.spyOn(membersRepo, "save").mockImplementation(async () => {});

    const commandOrError = Commands.CreateMemberCommand.create(mockToken, { username: "" });

    expect(commandOrError.isFailure()).toBe(true);
    expect(commandOrError.getError().type).toBe("MissingRequestParamsError");
    expect(commandOrError.getError().message).toContain("username");
    expect(saveSpy).toHaveBeenCalledTimes(0);
  });
});
