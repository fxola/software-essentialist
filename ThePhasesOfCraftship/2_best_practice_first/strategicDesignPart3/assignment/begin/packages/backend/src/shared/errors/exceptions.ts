export class InvalidBodyException extends Error {
  constructor(missingKeys: string[]) {
    super(`The following fields are required:${missingKeys.join(",")}`);
  }
}

export class InvalidEmailException extends Error {
  constructor(email: string) {
    super(`${email} is not a valid email address.`);
  }
}
