import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/errors/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

const assigmentDTO = () => {
  const forCreate = (body: unknown) => {
    const requiredFields = ["classId", "title"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredFields);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredFields);
    }

    const { classId, title } = body as { classId: unknown; title: unknown };

    if (typeof classId !== "string") {
      throw new InvalidTypeException("classId", "string");
    }

    if (!isUUID(classId)) {
      throw new InvalidUUIDException(classId);
    }

    if (typeof title !== "string") {
      throw new InvalidTypeException("title", "string");
    }

    return { classId, title };
  };

  const forSubmit = (body: unknown) => {
    const requiredFields = ["id"];
    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredFields);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredFields);
    }

    const { id } = body as { id: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) throw new InvalidUUIDException(id);

    return { id };
  };

  return { forCreate, forSubmit };
};

export type AssignmentDTO = ReturnType<typeof assigmentDTO>;
