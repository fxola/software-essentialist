export class InvalidBodyException extends Error {
  constructor(missingKeys: string[]) {
    super(`The following fields are required:${missingKeys.join(",")}`);
  }
}
