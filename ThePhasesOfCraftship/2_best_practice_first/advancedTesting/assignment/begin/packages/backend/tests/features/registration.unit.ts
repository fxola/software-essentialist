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
import { InMemoryUserRepository } from "../../src/modules/users/adapters/inMemoryUserRepository";
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
      //laster
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when(
      "I register with valid account details declining marketing emails",
      () => {},
    );

    then("I should be granted access to my account", () => {});

    and("I should not expect to receive marketing emails", () => {});
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when("I register with invalid account details", () => {});

    then(
      "I should see an error notifying me that my input is invalid",
      () => {},
    );

    and("I should not have been sent access to account details", () => {});
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given("a set of users already created accounts", (table) => {});

    when("new users attempt to register with those emails", () => {});

    then(
      "they should see an error notifying them that the account already exists",
      () => {},
    );

    and("they should not have been sent access to account details", () => {});
  });

  test("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {},
    );

    when(
      "new users attempt to register with already taken usernames",
      (table) => {},
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {},
    );

    and("they should not have been sent access to account details", () => {});
  });
});
