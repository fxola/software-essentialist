import { Database } from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentAssignmentNotFoundException,
} from "../../shared/errors/exceptions";
import { AssignmentDTO } from "./assignment-dto";

export function assigmentService(db: Database) {
  const create = async (dto: ReturnType<AssignmentDTO["forCreate"]>) => {
    const { title, classId } = dto;
    return await db.assignments.create(classId, title);
  };

  const submit = async (dto: ReturnType<AssignmentDTO["forSubmit"]>) => {
    const { id } = dto;

    const assignment = await db.assignments.getByStudent(id);
    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    return await db.assignments.submit(id);
  };

  const grade = async (dto: ReturnType<AssignmentDTO["forGrade"]>) => {
    const { id, grade } = dto;

    const assignment = await db.assignments.getByStudent(id);
    if (!assignment) {
      throw new StudentAssignmentNotFoundException();
    }

    return await db.assignments.grade(id, grade);
  };

  const getOne = async (dto: ReturnType<AssignmentDTO["forGetAssignment"]>) => {
    const { id } = dto;

    const assignment = await db.assignments.getOne(id);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return assignment;
  };

  return { create, submit, grade, getOne };
}

export type AssigmentsService = ReturnType<typeof assigmentService>;
