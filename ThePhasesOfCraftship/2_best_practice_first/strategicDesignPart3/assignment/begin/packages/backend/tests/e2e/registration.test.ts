import { loadFeature, defineFeature } from "jest-cucumber";
import path from "path";

const feature = loadFeature(
  path.join(__dirname, "../../../shared/acceptance/registration.feature")
);

defineFeature(feature, (test) => {
  test("Successful registration with marketing emails accepted", ({
    given,
    when,
    then,
    and,
  }) => {
    given("I am a new user", () => {});

    when(
      "I register with valid account details accepting marketing emails",
      () => {}
    );

    then("I should be granted access to my account", () => {});

    and("I should expect to receive marketing emails", () => {});
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
