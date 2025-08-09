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

  beforeAll(async () => {
    databaseFixture = new DatabaseFixture();
    const driver = await PuppeteerProtocolDriver.create({
      headless: false,
      slowMo: 50,
    });

    app = createAppObject(driver, "http://localhost:5173");
    pages = app.pages;
    layout = app.layout;
  });

  afterAll(async () => {});

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
    given("I am a new user", async () => {});

    when("I register with invalid account details", async () => {});

    then(
      "I should see an error notifying me that my input is invalid",
      async () => {},
    );

    and("I should not have been sent access to account details", () => {
      // @See backend
    });
  });

  test("Account already created with email", ({ given, when, then, and }) => {
    given(
      "a set of users already created accounts",
      async (table: CreateUserParams[]) => {},
    );

    when("new users attempt to register with those emails", async () => {});

    then(
      "they should see an error notifying them that the account already exists",
      async () => {},
    );

    and("they should not have been sent access to account details", () => {
      // @See backend
    });
  });
});
