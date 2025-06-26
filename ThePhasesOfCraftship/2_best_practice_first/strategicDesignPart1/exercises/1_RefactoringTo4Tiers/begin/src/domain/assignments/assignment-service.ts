import { Database } from "../../persistence";
import { AssignmentNotFoundException } from "../../shared/errors/exceptions";
import { AssignmentDTO } from "./assignment-dto";

function assigmentsService(db: Database) {
  const create = async (dto: ReturnType<AssignmentDTO["forCreate"]>) => {
    const { title, classId } = dto;
    return await db.assignments.create(classId, title);
  };

  const submit = async (dto: ReturnType<AssignmentDTO["forSubmit"]>) => {
    const { id } = dto;

    const assignment = await db.assignments.getById(id);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return await db.assignments.submit(id);
  };

  const grade = async (dto: ReturnType<AssignmentDTO["forGrade"]>) => {
    const { id, grade } = dto;

    const assignment = await db.assignments.getById(id);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return await db.assignments.grade(id, grade);
  };

  return { create, submit, grade };
}

export type AssigmentsService = ReturnType<typeof assigmentsService>;
