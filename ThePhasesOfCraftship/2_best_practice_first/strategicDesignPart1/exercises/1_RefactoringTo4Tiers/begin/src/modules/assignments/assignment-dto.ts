import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

export class SaveAssignmentDTO {
  constructor(public classId: string, public title: string) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["classId", "title"];

    const missingkeys = isMissingKeys(body, requiredKeys);
    if (missingkeys) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { classId, title } = body as {
      classId: unknown;
      title: unknown;
    };

    if (typeof title !== "string") {
      throw new InvalidTypeException("title", "string");
    }

    if (typeof classId !== "string") {
      throw new InvalidTypeException("classId", "string");
    }

    if (!isUUID(classId)) {
      throw new InvalidUUIDException(classId);
    }

    return new SaveAssignmentDTO(classId, title);
  }
}

export class SubmitAssignmentDTO {
  constructor(public id: string) {}
  public static prepare(body: unknown) {
    const requiredKeys = ["id"];

    const missingkeys = isMissingKeys(body, requiredKeys);
    if (missingkeys) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = body as { id: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) {
      throw new InvalidUUIDException(id);
    }

    return new SubmitAssignmentDTO(id);
  }
}

export type Grade = "A" | "B" | "C" | "D";
export class GradeStudentAssignmentDTO {
  constructor(public id: string, public grade: Grade) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["id", "grade"];
    const validGrades = ["A", "B", "C", "D"];

    const isValidGrade = (value: unknown): value is Grade => {
      return typeof value === "string" && validGrades.includes(value);
    };

    const missingkeys = isMissingKeys(body, requiredKeys);

    if (missingkeys) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id, grade } = body as { id: unknown; grade: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) {
      throw new InvalidUUIDException(id);
    }

    if (!isValidGrade(grade)) {
      throw new InvalidTypeException("grade", validGrades.join(" or "));
    }

    return new GradeStudentAssignmentDTO(id, grade);
  }
}

export class GetAssignmentDTO {
  constructor(public id: string) {}

  public static prepare(params: unknown) {
    const requiredKeys = ["id"];

    const missingkeys = isMissingKeys(params, requiredKeys);
    if (missingkeys) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = params as { id: unknown };

    if (typeof id !== "string") {
      throw new InvalidTypeException("id", "string");
    }

    if (!isUUID(id)) {
      throw new InvalidUUIDException(id);
    }

    return new GetAssignmentDTO(id);
  }
}
