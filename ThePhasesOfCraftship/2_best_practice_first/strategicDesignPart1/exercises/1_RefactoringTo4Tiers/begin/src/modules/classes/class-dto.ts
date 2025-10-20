import {
  InvalidRequestBodyException,
  InvalidTypeException,
  InvalidUUIDException,
} from "../../shared/exceptions";
import { isMissingKeys, isUUID } from "../../shared/utils";

export class CreateClassDTO {
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

    return new CreateClassDTO(name);
  }
}

export class CreateClassEnrollmentDTO {
  constructor(public studentId: string, public classId: string) {}

  public static prepare(body: unknown) {
    const requiredKeys = ["studentId", "classId"];

    const missingkeys = isMissingKeys(body, requiredKeys);
    if (missingkeys) {
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

    if (!isUUID(studentId)) {
      throw new InvalidUUIDException(studentId);
    }

    if (!isUUID(classId)) {
      throw new InvalidUUIDException(classId);
    }

    return new CreateClassEnrollmentDTO(studentId, classId);
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
