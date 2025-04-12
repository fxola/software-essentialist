import {
  InvalidRequestBodyException,
  InvalidTypeException,
} from "../../shared/exceptions";
import { isMissingKeys } from "../../shared/utils";

export class CreateClassDTO {
  constructor(public name: string) {}

  public static build(body: unknown) {
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

  public static build(body: unknown) {
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

    return new CreateClassEnrollmentDTO(studentId, classId);
  }
}
