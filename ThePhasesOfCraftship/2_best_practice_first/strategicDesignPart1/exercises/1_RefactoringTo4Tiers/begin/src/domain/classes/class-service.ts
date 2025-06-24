import { Database } from "../../persistence";
import {
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException,
} from "../../shared/errors/exceptions";
import { ClassDTO } from "./class-dto";

function classService(db: Database) {
  const save = async (dto: ReturnType<ClassDTO["forCreate"]>) => {
    return await db.classes.save(dto.name);
  };

  const saveEnrollment = async (
    dto: ReturnType<ClassDTO["forCreateEnrollment"]>
  ) => {
    const { classId, studentId } = dto;
    const student = await db.students.getById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const foundClass = await db.classes.getById(classId);
    if (!foundClass) {
      throw new ClassNotFoundException(classId);
    }

    const foundEnrollment = await db.classes.getEnrollment(classId, studentId);
    if (foundEnrollment) {
      throw new StudentAlreadyEnrolledException();
    }

    return await db.classes.saveEnrollment(classId, studentId);
  };

  return { save, saveEnrollment };
}

export type ClassService = ReturnType<typeof classService>;
