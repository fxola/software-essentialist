import {
  InvalidRequestBodyException,
  InvalidTypeException,
} from "../../shared/errors/exceptions";
import { isMissingKeys } from "../../shared/utils";

function classDTO() {
  const forCreate = (body: unknown) => {
    const requiredKeys = ["name"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = body as { name: unknown };

    if (typeof name !== "string") {
      throw new InvalidTypeException("name", "string");
    }

    return { name };
  };

  return { forCreate };
}

export type ClassDTO = ReturnType<typeof classDTO>;
