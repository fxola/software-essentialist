import PasswordValidator, { errorTypes } from "./index";

describe("password validator", () => {
  //Between 5 and 15 characters long
  // Contains at least one digit
  // Contains at least one upper case letter
  // Return an object containing a boolean result
  // and an errors key that — when provided with an invalid password
  // — contains an error message or type for all errors in occurrence.
  // There can be multiple errors at a single time.

  it("knows that password less than 5 characters is invalid", () => {
    const output = PasswordValidator.validate("s3rv");

    expect(output.result).toBeFalsy();
    expect(output.errors.length).toBeGreaterThanOrEqual(1);
    expect(output.errors).toContain(errorTypes.invalidPasswordLength);
  });
  it.todo("knows that password greater than 15 characters is invalid");
  it.todo("knows that password between 5 and 15 is valid");
  it.todo("knows that password containing no digit is invalid");
  it.todo("knows that password containing atleast 1 digit is valid");
  it.todo("knows that password containing no uppercase letter is invalid");
  it.todo("knows that password containing atleast 1 uppercase letter is valid");
});
