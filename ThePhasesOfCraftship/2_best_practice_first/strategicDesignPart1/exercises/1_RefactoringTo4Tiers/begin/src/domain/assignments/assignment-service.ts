import { Database } from "../../persistence";
import { CreateAssignmentDTO } from "./assignment-dto";

function assigmentsService(db: Database) {
  const saveAssignment = async (dto: CreateAssignmentDTO) => {
    const { title, classId } = dto;
    return await db.assignments.save(classId, title);
  };

  return { saveAssignment };
}

export type AssigmentsService = ReturnType<typeof assigmentsService>;
