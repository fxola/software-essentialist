export class InvalidPostFilterException extends Error {
  constructor(value: unknown) {
    super(`${value} is not a valid filter for posts`);
  }
}
