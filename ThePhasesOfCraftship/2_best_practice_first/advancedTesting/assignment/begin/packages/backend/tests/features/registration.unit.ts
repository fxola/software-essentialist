import path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import {
  CreateUserParams,
  CreateUserResponse,
} from "@dddforum/shared/src/api/users";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { Config } from "../../src/shared/config";
import { createAPIClient } from "@dddforum/shared/src/api";
import { AddEmailToListResponse } from "@dddforum/shared/src/api/marketing";
import { WebServer } from "../../src/shared/http";
import { InMemoryUserRepositorySpy } from "../../src/modules/users/adapters/inMemoryUserRepositorySpy";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
);

defineFeature(feature, (test) => {
  const apiClient = createAPIClient("http://localhost:3000");
  let composition: CompositionRoot;
  const config = new Config("test:unit");
  let server: WebServer;

  let addEmailToListResponse: AddEmailToListResponse;
  let fakeUserRepo: InMemoryUserRepositorySpy;

  beforeAll(async () => {
    composition = CompositionRoot.createCompositionRoot(config);
    server = composition.getWebServer();
    await server.start();

    fakeUserRepo = composition.getRepositories()
      .users as InMemoryUserRepositorySpy;
  });

  afterEach(() => {
    fakeUserRepo.reset();
  });

  afterAll(async () => {
    await server.stop();
  });

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;
    let createUserResponse: CreateUserResponse;

    given("I am a new user", async () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await apiClient.users.register(user);
        addEmailToListResponse = await apiClient.marketing.addEmailToList(
          user.email,
        );
      },
    );

    then("I should be granted access to my account", async () => {
      expect(createUserResponse.success).toBeTruthy();
      expect(createUserResponse.data.id).toBeTruthy();
      expect(createUserResponse.data.email).toBe(user.email);
      expect(createUserResponse.data.firstName).toBe(user.firstName);
      expect(createUserResponse.data.lastName).toBe(user.lastName);
      expect(createUserResponse.data.lastName).toBe(user.lastName);

      const fetchedUser = await apiClient.users.getUserByEmail(
        createUserResponse.data.email,
      );
      expect(fetchedUser.data.email).toBe(createUserResponse.data.email);
      expect(fakeUserRepo.getNumberOfTimesCalled("save")).toBe(1);
    });

    and("I should expect to receive marketing emails", () => {
      //todo
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;
    let createUserResponse: CreateUserResponse;

    given("I am a new user", async () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when(
      "I register with valid account details declining marketing emails",
      async () => {
        createUserResponse = await apiClient.users.register(user);
      },
    );

    then("I should be granted access to my account", async () => {
      expect(createUserResponse.success).toBeTruthy();
      expect(createUserResponse.data.id).toBeTruthy();
      expect(createUserResponse.data.email).toBe(user.email);
      expect(createUserResponse.data.firstName).toBe(user.firstName);
      expect(createUserResponse.data.lastName).toBe(user.lastName);
      expect(createUserResponse.data.lastName).toBe(user.lastName);

      const fetchedUser = await apiClient.users.getUserByEmail(
        createUserResponse.data.email,
      );
      expect(fetchedUser.data.email).toBe(createUserResponse.data.email);
      expect(fakeUserRepo.getNumberOfTimesCalled("save")).toBe(1);
    });

    and("I should not expect to receive marketing emails", () => {
      //todo
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;
    let createUserResponse: CreateUserResponse;
    given("I am a new user", () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
    });

    when("I register with invalid account details", async () => {
      const { firstName, ...invalidUser } = user;

      createUserResponse = await apiClient.users.register(
        invalidUser as CreateUserParams,
      );
    });

    then("I should see an error notifying me that my input is invalid", () => {
      expect(createUserResponse.success).toBeFalsy();
      expect(createUserResponse.error).toBeTruthy();
      expect(createUserResponse.error.code).toBe("ValidationError");
      expect(fakeUserRepo.getNumberOfTimesCalled("save")).toBe(0);
    });

    and("I should not have been sent access to account details", () => {
      //todo
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let users: CreateUserParams[] = [];
    let createUserResponse: CreateUserResponse;

    given("a set of users already created accounts", async (table) => {
      for (let user of table) {
        user.username = user.firstName + user.lastName;
        await apiClient.users.register(user);
        users.push(user);
      }

      fakeUserRepo.resetCalls();
    });

    when("new users attempt to register with those emails", async () => {
      const newUser = new CreateUserBuilder()
        .withAllRandomDetails()
        .withEmail(users[0].email)
        .build();

      createUserResponse = await apiClient.users.register(newUser);
    });

    then(
      "they should see an error notifying them that the account already exists",
      () => {
        expect(createUserResponse.success).toBeFalsy();
        expect(createUserResponse.error.code).toBe("EmailAlreadyInUse");
        expect(fakeUserRepo.getNumberOfTimesCalled("save")).toBe(0);
      },
    );

    and("they should not have been sent access to account details", () => {
      //todo
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let createUserResponses: CreateUserResponse[] = [];
    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        for (let user of table) {
          await apiClient.users.register(user);
        }

        fakeUserRepo.resetCalls();
      },
    );

    when(
      "new users attempt to register with already taken usernames",
      async (table) => {
        for (let user of table) {
          const response = await apiClient.users.register(user);
          createUserResponses.push(response);
        }
      },
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        for (let createUserResponse of createUserResponses) {
          expect(createUserResponse.success).toBeFalsy();
          expect(createUserResponse.error.code).toBe("UsernameAlreadyTaken");
          expect(fakeUserRepo.getNumberOfTimesCalled("save")).toBe(0);
        }
      },
    );

    and("they should not have been sent access to account details", () => {
      //todo
    });
  });
});
