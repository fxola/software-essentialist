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

  it("knows that password greater than 15 characters is invalid", () => {
    const output = PasswordValidator.validate("sm1th3r33nsFromGam3OfThron3s");

    expect(output.result).toBeFalsy();
    expect(output.errors.length).toBeGreaterThanOrEqual(1);
    expect(output.errors).toContain(errorTypes.invalidPasswordLength);
  });

  it("knows that password between 5 and 15 is valid", () => {
    const output = PasswordValidator.validate("manGr00ve");
    expect(output.result).toBeTruthy();
    expect(output.errors.length).toBe(0);
  });

  it("knows that password containing no digit is invalid", () => {
    const output = PasswordValidator.validate("smithereens");

    expect(output.result).toBeFalsy();
    expect(output.errors.length).toBeGreaterThanOrEqual(1);
    expect(output.errors).toContain(errorTypes.noDigitsInPassword);
  });

  it("knows that password containing atleast 1 digit is valid", () => {
    const output = PasswordValidator.validate("Smithereens20");

    expect(output.result).toBeTruthy();
    expect(output.errors.length).toBe(0);
  });

  it("knows that password containing no uppercase letter is invalid", () => {
    const output = PasswordValidator.validate("smithereens20");

    expect(output.result).toBeFalsy();
    expect(output.errors.length).toBeGreaterThanOrEqual(1);
    expect(output.errors).toContain(errorTypes.noUppercaseLetterInPassword);
  });

  it("knows that password containing atleast 1 uppercase letter is valid", () => {
    const output = PasswordValidator.validate("Valid01passworD");

    expect(output.result).toBeTruthy();
    expect(output.errors.length).toBe(0);
  });

  it("knows that password not meeting all the required criterias returns muiltiple errors", () => {
    const output = PasswordValidator.validate("tiny");

    expect(output.result).toBeFalsy();
    expect(output.errors.length).toBe(3);
    expect(output.errors).toContain(errorTypes.invalidPasswordLength);
    expect(output.errors).toContain(errorTypes.noDigitsInPassword);
    expect(output.errors).toContain(errorTypes.noUppercaseLetterInPassword);
  });
});
