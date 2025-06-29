import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/errors/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

function studentDTO() {
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

  const forGiveAssignment = (body: unknown) => {
    const requiredKeys = ["studentId", "assignmentId"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, assignmentId } = body as {
      studentId: unknown;
      assignmentId: unknown;
    };

    if (typeof studentId !== "string") {
      throw new InvalidTypeException("studentId", "string");
    }
    if (typeof assignmentId !== "string") {
      throw new InvalidTypeException("assignmentId", "string");
    }

    if (!isUUID(studentId)) throw new InvalidUUIDException(studentId);
    if (!isUUID(assignmentId)) throw new InvalidUUIDException(assignmentId);

    return { studentId, assignmentId };
  };

  const forSingleStudent = (body: unknown) => {
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

  return { forCreate, forGiveAssignment, forSingleStudent };
}

export type StudentDTO = ReturnType<typeof studentDTO>;
