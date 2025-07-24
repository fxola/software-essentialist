export class InvalidBodyException extends Error {
  constructor(missingKeys: string[]) {
    super(`The following fields are required: ${missingKeys.join(",")}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidEmailException extends Error {
  constructor(email: string) {
    super(`${email} is not a valid email address.`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
