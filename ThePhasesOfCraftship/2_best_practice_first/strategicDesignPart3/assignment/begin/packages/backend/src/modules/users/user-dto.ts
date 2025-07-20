import { InvalidBodyException } from "../../shared/errors";
import { InvalidEmailException } from "../../shared/errors/exceptions";
import { isMissingKeys, isValidEmail } from "../../shared/utils";

export class CreateUserDTO {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public username: string
  ) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["email", "firstName", "lastName", "username"];
    const keyIsMissing = isMissingKeys(body, requiredKeys);

    if (keyIsMissing || !body || typeof body !== "object") {
      throw new InvalidBodyException(requiredKeys);
    }

    const { email, firstName, lastName, username } = body as {
      email: string;
      firstName: string;
      lastName: string;
      username: string;
    };

    if (!isValidEmail(email)) {
      throw new InvalidEmailException(email);
    }

    return new CreateUserDTO(email, firstName, lastName, username);
  }
}

export class GetUserByEmailDTO {
  constructor(public email: string) {}

  public static prepare(query: unknown) {
    const requiredKeys = ["email"];
    const keyIsMissing = isMissingKeys(query, requiredKeys);

    if (keyIsMissing || !query || typeof query !== "object") {
      throw new InvalidBodyException(requiredKeys);
    }

    const { email } = query as { email: string };

    if (!isValidEmail(email)) {
      throw new InvalidEmailException(email);
    }

    return new GetUserByEmailDTO(email);
  }
}
