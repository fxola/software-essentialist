export class EmailInUseException extends Error {
  constructor() {
    super(`This email has already been taken`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UsernameTakenException extends Error {
  constructor() {
    super(`This username has already been taken`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UserNotFoundException extends Error {
  constructor() {
    super(`User not found`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
