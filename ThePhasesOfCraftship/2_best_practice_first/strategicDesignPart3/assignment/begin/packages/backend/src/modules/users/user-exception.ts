export class EmailInUseException extends Error {
  constructor() {
    super(`This email has already been taken`);
  }
}

export class UsernameTakenException extends Error {
  constructor() {
    super(`This username has already been taken`);
  }
}

export class UserNotFoundException extends Error {
  constructor() {
    super(`User not found`);
  }
}
