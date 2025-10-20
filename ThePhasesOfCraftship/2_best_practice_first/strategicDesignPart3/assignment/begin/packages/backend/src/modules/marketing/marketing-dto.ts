import {
  InvalidBodyException,
  InvalidEmailException,
} from "../../shared/errors/exceptions";
import { isMissingKeys, isValidEmail } from "../../shared/utils";

export class AddEmailDTO {
  constructor(public email: string) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["email"];
    const keyIsMissing = isMissingKeys(body, requiredKeys);

    if (keyIsMissing || !body || typeof body !== "object") {
      throw new InvalidBodyException(requiredKeys);
    }

    const { email } = body as { email: string };

    if (!isValidEmail(email)) {
      throw new InvalidEmailException(email);
    }

    return new AddEmailDTO(email);
  }
}
