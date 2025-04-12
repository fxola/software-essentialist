import {
  InvalidRequestBodyException,
  InvalidTypeException,
} from "../../shared/exceptions";
import { isMissingKeys } from "../../shared/utils";

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
