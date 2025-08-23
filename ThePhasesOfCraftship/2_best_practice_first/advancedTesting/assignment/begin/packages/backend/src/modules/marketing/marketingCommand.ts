import {
  InvalidEmailException,
  InvalidRequestBodyException,
} from "@dddforum/backend/src/shared/exceptions";
import { isMissingKeys } from "@dddforum/backend/src/shared/utils/parser";

export class AddEmailCommand {
  constructor(public props: { email: string }) {}

  static fromRequest(body: unknown) {
    const requiredKeys = ["email"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { email } = body as { email: string };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new InvalidEmailException();
    }

    return new AddEmailCommand({ email });
  }

  get email() {
    return this.props.email;
  }
}
