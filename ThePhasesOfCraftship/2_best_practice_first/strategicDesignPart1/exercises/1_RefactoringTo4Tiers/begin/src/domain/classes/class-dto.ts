import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/errors/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

export function classDTO() {
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

    if (!isUUID(classId)) throw new InvalidUUIDException(classId);
    if (!isUUID(studentId)) throw new InvalidUUIDException(studentId);

    return { classId, studentId };
  };

  const forGetAssignments = (body: unknown) => {
    const requiredKeys = ["id"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = body as { id: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) throw new InvalidUUIDException(id);

    return { id };
  };

  return { forCreate, forCreateEnrollment, forGetAssignments };
}

export type ClassDTO = ReturnType<typeof classDTO>;
