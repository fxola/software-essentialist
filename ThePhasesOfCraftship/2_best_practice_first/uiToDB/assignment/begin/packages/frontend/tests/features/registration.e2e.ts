import { defineFeature, loadFeature } from "jest-cucumber";
import { sharedTestRoot } from "@dddforum/shared/src/paths";
import { CreateUserParams } from "@dddforum/shared/src/api/users";
import { CreateUserBuilder } from "@dddforum/shared/tests/support/builders/createUserBuilder";
import { App, createAppObject } from "../support/pages/app";

import * as path from "path";
import { DatabaseFixture } from "@dddforum/shared/tests/support/fixtures/databaseFixture";
import { PuppeteerProtocolDriver } from "../support/protocol-driver";

const feature = loadFeature(
  path.join(sharedTestRoot, "features/registration.feature"),
  { tagFilter: "@frontend" },
);

defineFeature(feature, (test) => {
  let databaseFixture: DatabaseFixture;
  let app: App;
  let pages: App["pages"];
  let layout: App["layout"];
  let driver: PuppeteerProtocolDriver;

  beforeAll(async () => {
    databaseFixture = new DatabaseFixture();
    driver = await PuppeteerProtocolDriver.create({
      headless: false,
      slowMo: 50,
    });

    app = createAppObject(driver, "http://localhost:5173");
    pages = app.pages;
    layout = app.layout;
  });

  afterAll(async () => {
    await driver.close();
  });

  afterEach(async () => {
    await databaseFixture.resetDatabase();
  });

  // Need to put timeout here.
  jest.setTimeout(60000);

  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    let user: CreateUserParams;
    given("I am a new user", async () => {
      user = new CreateUserBuilder().withAllRandomDetails().build();
      await pages.registration.open();
    });

    when(
      "I register with valid account details accepting marketing emails",
      async () => {
        await pages.registration.enterUserDetails(user);
        await pages.registration.acceptMarketingEmail();
        await pages.registration.submitRegistrationForm();
      },
    );

    then("I should be granted access to my account", async () => {
      const loggedInUsername = await layout.header.getLoggedInUsername();
      expect(loggedInUsername).toContain(user.username);
    });

    and("I should expect to receive marketing emails", () => {
      // @See backend
    });
  });

  test("Invalid or missing registration details", ({
    given,
    when,
    then,
    and,
  }) => {
    let invalidUser: CreateUserParams;
    given("I am a new user", async () => {
      invalidUser = new CreateUserBuilder()
        .withFirstName("Jon")
        .withLastName("Bellion")
        .withUsername("JB")
        .build();

      await pages.registration.open();
    });

    when("I register with invalid account details", async () => {
      invalidUser.email = "providinganinvalidemail";

      await pages.registration.enterUserDetails(invalidUser);
      await pages.registration.submitRegistrationForm();
    });

    then(
      "I should see an error notifying me that my input is invalid",
      async () => {
        const errorText = await app.notifications.getErrorMessage();
        expect(errorText).toContain("Email invalid");
      },
    );

    and("I should not have been sent access to account details", async () => {
      const loggedInUsername = await layout.header.getLoggedInUsername();
      expect(loggedInUsername).toBeUndefined();
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    let users: CreateUserParams[] = [];
    given(
      "a set of users already created accounts",
      async (table: CreateUserParams[]) => {
        table.forEach((user) => {
          const newUser = new CreateUserBuilder()
            .withEmail(user.email)
            .withFirstName(user.firstName)
            .withLastName(user.lastName)
            .withUsername(user.firstName + user.lastName)
            .build();

          users.push(newUser);
        });

        await databaseFixture.setupWithExistingUsers(users);
      },
    );

    when("new users attempt to register with those emails", async () => {
      await pages.registration.open();

      const registeredUser = users[0];
      await pages.registration.enterUserDetails(registeredUser);
      await pages.registration.submitRegistrationForm();
    });

    then(
      "they should see an error notifying them that the account already exists",
      async () => {
        const errorText = await app.notifications.getErrorMessage();
        expect(errorText).toContain("Email already in use");
      },
    );

    and(
      "they should not have been sent access to account details",
      async () => {
        const loggedInUsername = await layout.header.getLoggedInUsername();
        expect(loggedInUsername).toBeUndefined();
      },
    );
  });
});
