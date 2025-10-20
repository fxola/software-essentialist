import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

export class CreateStudentDTO {
  constructor(public name: string) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["name"];

    const missingkeys = isMissingKeys(body, requiredKeys);
    if (missingkeys) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = body as { name: unknown };

    if (typeof name !== "string") {
      throw new InvalidTypeException("name", "string");
    }

    return new CreateStudentDTO(name);
  }
}

export class GetStudentDTO {
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
    return new GetStudentDTO(id);
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

export class GetStudentAssignmentsDTO {
  constructor(public studentId: string) {}

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

    return new GetStudentAssignmentsDTO(id);
  }
}
