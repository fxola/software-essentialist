//Write a function (or a stateless class) for validating passwords.
// Passwords must meet the following criteria:
//Between 5 and 15 characters long
// Contains at least one digit
// Contains at least one upper case letter
// Return an object containing a boolean result
// and an errors key that — when provided with an invalid password
// — contains an error message or type for all errors in occurrence.
// There can be multiple errors at a single time.

type ValidationResult = {
  result: boolean;
  errors: ErrorMessages[];
};

export const errorTypes = {
  invalidPasswordLength: "Invalid password length. Must be between 5 and 15",
} as const;

type ErrorMessages = (typeof errorTypes)[keyof typeof errorTypes];

export default class PasswordValidator {
  public static validate(password: string): ValidationResult {
    let errors: ErrorMessages[] = [];

    const isValidPasswordLength = password.length >= 5 && password.length <= 15;
    if (!isValidPasswordLength) {
      errors.push(errorTypes.invalidPasswordLength);
    }

    return {
      result: errors.length < 1,
      errors,
    };
  }
}
