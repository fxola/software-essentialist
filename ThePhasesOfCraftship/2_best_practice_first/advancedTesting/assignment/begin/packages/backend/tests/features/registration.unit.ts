import {
  CreateUserParams,
  CreateUserResponse,
} from "@dddforum/shared/src/api/users";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { CompositionRoot } from "../../src/shared/compositionRoot";
import { Config } from "../../src/shared/config";
import { createAPIClient } from "@dddforum/shared/src/api";
import { AddEmailToListResponse } from "@dddforum/shared/src/api/marketing";
import { UserRepository } from "../../src/modules/users/ports/userRepository";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
);

defineFeature(feature, (test) => {
  const apiClient = createAPIClient("http://localhost:3000");
  let composition: CompositionRoot;
  const config = new Config("test:unit");

  let addEmailToListResponse: AddEmailToListResponse;
  let fakeUserRepo: UserRepository;

  beforeAll(() => {
    composition = CompositionRoot.createCompositionRoot(config);
    fakeUserRepo = composition.getRepositories().users;
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
        users.push(user);
        await apiClient.users.register(user);
      }
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
      },
    );

    and("they should not have been sent access to account details", () => {
      //todo
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let users: CreateUserParams[] = [];
    let createUserResponse: CreateUserResponse;
    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        for (let user of table) {
          const idx = table.findIndex(
            (u: CreateUserParams) => u.email === user.email,
          );
          const userWithUsername = { ...user, username: `username-${idx}` };
          users.push(userWithUsername);
          await apiClient.users.register(userWithUsername);
        }
      },
    );

    when(
      "new users attempt to register with already taken usernames",
      async (table) => {
        const newUser = new CreateUserBuilder()
          .withAllRandomDetails()
          .withUsername(users[0].username)
          .build();

        createUserResponse = await apiClient.users.register(newUser);
      },
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        expect(createUserResponse.success).toBeFalsy();
        expect(createUserResponse.error.code).toBe("UsernameAlreadyTaken");
      },
    );

    and("they should not have been sent access to account details", () => {
      //todo
    });
  });
});
