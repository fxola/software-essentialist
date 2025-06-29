import { Database } from "../../persistence";
import {
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException,
} from "../../shared/errors/exceptions";
import { ClassDTO } from "./class-dto";

function classService(db: Database) {
  const create = async (dto: ReturnType<ClassDTO["forCreate"]>) => {
    return await db.classes.create(dto.name);
  };

  const createEnrollment = async (
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

    return await db.classes.createEnrollment(classId, studentId);
  };

  const getAssignments = async (
    dto: ReturnType<ClassDTO["forGetAssignments"]>
  ) => {
    const { id } = dto;
    const foundClass = await db.classes.getById(id);
    if (!foundClass) {
      throw new ClassNotFoundException(id);
    }

    const classAssignments = await db.classes.getAssignments(id);
    return classAssignments;
  };

  return { create, createEnrollment, getAssignments };
}

export type ClassService = ReturnType<typeof classService>;
