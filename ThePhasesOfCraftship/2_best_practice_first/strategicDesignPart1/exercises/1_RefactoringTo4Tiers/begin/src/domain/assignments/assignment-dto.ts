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

export class GiveStudentAssignmentDTO {
  constructor(public studentId: string, public assignmentId: string) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["studentId", "assignmentId"];

    const missingkeys = isMissingKeys(body, requiredKeys);
    if (missingkeys) {
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

    if (!isUUID(assignmentId)) {
      throw new InvalidUUIDException(assignmentId);
    }

    if (!isUUID(studentId)) {
      throw new InvalidUUIDException(studentId);
    }

    return new GiveStudentAssignmentDTO(studentId, assignmentId);
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
export class GetAllAssignmentsDTO {
  constructor(public classId: string) {}

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

    return new GetAllAssignmentsDTO(id);
  }
}
