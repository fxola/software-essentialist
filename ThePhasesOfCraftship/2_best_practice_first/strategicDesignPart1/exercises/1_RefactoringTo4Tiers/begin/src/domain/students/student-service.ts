import { Database } from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/errors/exceptions";
import { StudentDTO } from "./student-dto";

function studentService(db: Database) {
  const create = async (dto: ReturnType<StudentDTO["forCreate"]>) => {
    return await db.students.create(dto.name);
  };

  const giveAssignment = async (
    dto: ReturnType<StudentDTO["forGiveAssignment"]>
  ) => {
    const { studentId, assignmentId } = dto;

    const student = await db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await db.assignments.getById(assignmentId);

    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    const studentAssignment = await db.students.giveAssignment(
      studentId,
      assignmentId
    );

    return studentAssignment;
  };

  const getAll = async () => {
    const students = await db.students.getAll();
    return students;
  };

  return { create, giveAssignment, getAll };
}

export type StudentService = ReturnType<typeof studentService>;
