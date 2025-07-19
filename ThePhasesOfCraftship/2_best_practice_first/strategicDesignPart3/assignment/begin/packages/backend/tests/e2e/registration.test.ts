import { loadFeature, defineFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { resetDatabase } from "../operations/reset-database";
import { seedUsers } from "../operations/seed-users";
import { CreateUserInput } from "@dddforum/shared/src/api/users";
import { CreateuserBuilder } from "../builders";
import { app, contactlist, Errors } from "../../src";

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
      expect(contactlist.includes(user.email)).toBeTruthy();

      contactlist.pop();
    });
  });

  test("Successful registration without marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserResponse: any;

    let user: CreateUserInput;
    given("I am a new user", () => {
      user = new CreateuserBuilder().withRandomDetails().build();
    });

    when(
      "I register with valid account details declining marketing emails",
      async () => {
        createUserResponse = await request(app).post("/users/new").send(user);
      }
    );

    then("I should be granted access to my account", () => {
      expect(createUserResponse.status).toBe(201);
      expect(createUserResponse.body.data.firstName).toBe(user.firstName);
      expect(createUserResponse.body.data.lastName).toBe(user.lastName);
      expect(createUserResponse.body.data.email).toBe(user.email);
      expect(createUserResponse.body.data.username).toBe(user.username);
    });

    and("I should not expect to receive marketing emails", () => {
      expect(contactlist.includes(user.email)).toBeFalsy();
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let createUserResponse: any;
    let user: Partial<CreateUserInput>;

    given("I am a new user", () => {
      user = new CreateuserBuilder().withRandomDetails().build();

      const { username, ...incompleteUserDetails } = user;
      user = incompleteUserDetails;
    });

    when("I register with invalid account details", async () => {
      createUserResponse = await request(app).post("/users/new").send(user);
    });

    then("I should see an error notifying me that my input is invalid", () => {
      expect(createUserResponse.status).toBe(400);
      expect(createUserResponse.body.success).toBeFalsy();
      expect(createUserResponse.body.error).toBe(Errors.ValidationError);
    });

    and("I should not have been sent access to account details", () => {
      expect(contactlist.includes(user.email!)).toBeFalsy();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let createUserResponses: any;
    let users: CreateUserInput[];

    given("a set of users already created accounts", async (table) => {
      users = table.map((row: CreateUserInput) => {
        return new CreateuserBuilder()
          .withFirstName(row.firstName)
          .withLastName(row.lastName)
          .withEmail(row.email)
          .withUsername(row.firstName + row.lastName)
          .build();
      });

      await seedUsers(users);
    });

    when("new users attempt to register with those emails", async () => {
      createUserResponses = await Promise.all(
        users.map((user) => request(app).post("/users/new").send(user))
      );
    });

    then(
      "they should see an error notifying them that the account already exists",
      () => {
        createUserResponses.forEach((response: any) => {
          expect(response.status).toBe(409);
          expect(response.body.success).toBeFalsy();
          expect(response.body.error).toBe(Errors.EmailAlreadyInUse);
        });
      }
    );

    and("they should not have been sent access to account details", () => {
      users.forEach((user) => {
        expect(contactlist.includes(user.email)).toBeFalsy();
      });
    });
  });

  test("Username already taken", ({ given, when, then, and }) => {
    let createUserResponses: any;
    let users: CreateUserInput[];
    given(
      "a set of users have already created their accounts with valid details",
      async (table) => {
        users = table.map((row: CreateUserInput) => {
          return new CreateuserBuilder()
            .withFirstName(row.firstName)
            .withLastName(row.lastName)
            .withEmail(row.email)
            .withUsername(row.username)
            .build();
        });

        await seedUsers(users);
      }
    );

    when(
      "new users attempt to register with already taken usernames",
      async (table) => {
        createUserResponses = await Promise.all(
          table.map((user: CreateUserInput) =>
            request(app).post("/users/new").send(user)
          )
        );
      }
    );

    then(
      "they see an error notifying them that the username has already been taken",
      () => {
        createUserResponses.forEach((response: any) => {
          expect(response.status).toBe(409);
          expect(response.body.success).toBeFalsy();
          expect(response.body.error).toBe(Errors.UsernameAlreadyTaken);
        });
      }
    );

    and("they should not have been sent access to account details", () => {
      users.forEach((user) => {
        expect(contactlist.includes(user.email)).toBeFalsy();
      });
    });
  });
});
