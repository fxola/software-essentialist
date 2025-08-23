import { createAPIClient } from "@dddforum/shared/src/api";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { Config } from "../../src/shared/config";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { CreateUserParams } from "@dddforum/shared/src/api/users";

describe("Users API", () => {
  const apiClient = createAPIClient("http://localhost:3000");
  const config = new Config("test:infra");
  const composition = CompositionRoot.createCompositionRoot(config);
  const server = composition.getWebServer();
  const application = composition.getApplication();

  let createUserSpy: jest.SpyInstance;

  beforeAll(async () => {
    await server.start();
    createUserSpy = jest.spyOn(application.users, "createUser");
  });

  afterEach(() => {
    createUserSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it("Can register users successfully", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();

    await apiClient.users.register(user);

    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith({ props: user });
  });

  it("Can fail to register user when invalid details are provided", async () => {
    const user = new CreateUserBuilder().withAllRandomDetails().build();
    const { username, ...invalidUser } = user;

    await apiClient.users.register(invalidUser as CreateUserParams);

    expect(createUserSpy).toHaveBeenCalledTimes(0);
  });
});
