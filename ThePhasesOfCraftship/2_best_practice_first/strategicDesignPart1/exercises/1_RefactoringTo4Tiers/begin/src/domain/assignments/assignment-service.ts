import Database from "../../persistence";
import { SaveAssignmentDTO } from "./assignment-dto";

class AssignmentService {
  constructor(private db: Database) {}

  async saveAssignment(dto: SaveAssignmentDTO) {
    const { classId, title } = dto;

    const result = await this.db.assignments.save(classId, title);

    return result;
  }
}

export default AssignmentService;
