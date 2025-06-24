import { Database } from "../../persistence";
import { AssignmentDTO } from "./assignment-dto";

function assigmentsService(db: Database) {
  const saveAssignment = async (
    dto: ReturnType<AssignmentDTO["forCreate"]>
  ) => {
    const { title, classId } = dto;
    return await db.assignments.save(classId, title);
  };

  return { saveAssignment };
}

export type AssigmentsService = ReturnType<typeof assigmentsService>;
