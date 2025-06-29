import {
  InvalidGradeException,
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/errors/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

type Grade = "A" | "B" | "C" | "D";

export const assigmentDTO = () => {
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

  const forGrade = (body: unknown) => {
    const requiredFields = ["id", "grade"];
    const validGrades = ["A", "B", "C", "D"];

    const isValidGrade = (value: unknown): value is Grade => {
      return typeof value === "string" && validGrades.includes(value);
    };

    const isInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredFields);

    if (isInvalid) {
      throw new InvalidRequestBodyException(requiredFields);
    }

    const { id, grade } = body as { id: unknown; grade: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) throw new InvalidUUIDException(id);
    if (!isValidGrade(grade)) throw new InvalidGradeException(validGrades);

    return { id, grade };
  };

  const forGetAssignment = (body: unknown) => {
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

  return { forCreate, forSubmit, forGrade, forGetAssignment };
};

export type AssignmentDTO = ReturnType<typeof assigmentDTO>;
