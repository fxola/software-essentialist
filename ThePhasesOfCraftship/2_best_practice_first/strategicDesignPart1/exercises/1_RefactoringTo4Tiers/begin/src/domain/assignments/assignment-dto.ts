import {
  InvalidRequestBodyException,
  InvalidTypeException,
} from "../../shared/errors/exceptions";
import { isMissingKeys } from "../../shared/utils";

export const createAssigmentDTO = (body: unknown) => {
  const requiredFields = ["classId", "title"];
  const isInvalid =
    !body || typeof body !== "object" || isMissingKeys(body, requiredFields);

  if (isInvalid) {
    throw new InvalidRequestBodyException(requiredFields);
  }

  const { classId, title } = body as { classId: unknown; title: unknown };
  if (typeof classId !== "string") {
    throw new Error("classId must be a string");
  }

  if (typeof title !== "string") {
    throw new InvalidTypeException("classId", "string");
  }

  return { classId, title };
};

export type CreateAssignmentDTO = ReturnType<typeof createAssigmentDTO>;
