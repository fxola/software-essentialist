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

  const forCreateEnrollment = (body: unknown) => {
    const requiredKeys = ["studentId", "classId"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, classId } = body as {
      studentId: unknown;
      classId: unknown;
    };

    if (typeof studentId !== "string") {
      throw new InvalidTypeException("studentId", "string");
    }

    if (typeof classId !== "string") {
      throw new InvalidTypeException("classId", "string");
    }
    return { classId, studentId };
  };

  return { forCreate, forCreateEnrollment };
}

export type ClassDTO = ReturnType<typeof classDTO>;
