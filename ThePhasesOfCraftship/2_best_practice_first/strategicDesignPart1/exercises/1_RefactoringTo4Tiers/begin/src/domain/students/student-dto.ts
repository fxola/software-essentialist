import {
  InvalidRequestBodyException,
  InvalidTypeException,
} from "../../shared/errors/exceptions";
import { isMissingKeys } from "../../shared/utils";

export function createStudentDTO(body: unknown) {
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
}

export type CreateStudentDTO = ReturnType<typeof createStudentDTO>;
