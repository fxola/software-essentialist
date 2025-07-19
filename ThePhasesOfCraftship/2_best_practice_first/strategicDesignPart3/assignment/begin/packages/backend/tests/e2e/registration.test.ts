import { loadFeature, defineFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { resetDatabase } from "../operations/reset-database";
import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { CreateuserBuilder } from "../builders";
import { app } from "../../src";

const feature = loadFeature(
  path.join(__dirname, "../../../shared/tests/features/registration.feature")
);

defineFeature(feature, (test) => {
  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    beforeEach(async () => {
      await resetDatabase();
    });

    let createUserResponse: any;
    let acceptMarketingResponse: any;

    let user: CreateUserInput;

    given("I am a new user", () => {
      user = new CreateuserBuilder()
        .withFirstName("Ade")
        .withLastName("Bayo")
        .withEmail("ab@yahoomail.com")
        .withUsername("adebayo")
        .build();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        createUserResponse = await request(app).post("/users/new").send(user);

        acceptMarketingResponse = await request(app)
          .post("/marketing/new")
          .send({ email: user.email });
      }
    );

    then("I should be granted access to my account", () => {
      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.body.data.firstName).toBe(user.firstName);
      expect(createUserResponse.body.data.lastName).toBe(user.lastName);
      expect(createUserResponse.body.data.email).toBe(user.email);
      expect(createUserResponse.body.data.username).toBe(user.username);
    });

    and("I should expect to receive marketing emails", () => {
      expect(acceptMarketingResponse.status).toBe(201);
      expect(acceptMarketingResponse.body.success).toBeTruthy();
      expect(acceptMarketingResponse.body.data.email).toBe(user.email);
      expect(acceptMarketingResponse.body.data.message).toBe(
        "Email added succesfully"
      );
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
      () => {}
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
      () => {}
    );

    and("I should not have been sent access to account details", () => {});
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given("a set of users already created accounts", (table) => {});

    when("new users attempt to register with those emails", () => {});

    then(
      "they should see an error notifying them that the account already exists",
      () => {}
    );

    and("they should not have been sent access to account details", () => {});
  });

  test("Username already taken", ({ given, when, then, and }) => {
    given(
      "a set of users have already created their accounts with valid details",
      (table) => {}
    );

    when(
      "new users attempt to register with already taken usernames",
      (table) => {}
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {}
    );

    and("they should not have been sent access to account details", () => {});
  });
});
