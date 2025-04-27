import Database from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentAssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import { GetStudentAssignmentsDTO } from "../students/student-dto";
import {
  GradeStudentAssignmentDTO,
  SaveAssignmentDTO,
  SubmitAssignmentDTO,
  GetAssignmentDTO,
} from "./assignment-dto";

class AssignmentService {
  constructor(private db: Database) {}

  async saveAssignment(dto: SaveAssignmentDTO) {
    const { classId, title } = dto;

    const result = await this.db.assignments.save(classId, title);

    return result;
  }

  async submitAssignment(dto: SubmitAssignmentDTO) {
    const { id } = dto;

    const studentAssignment = await this.db.assignments.getStudentAssignment(
      id
    );

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const result = await this.db.assignments.submit(id);

    return result;
  }

  async gradeAssignment(dto: GradeStudentAssignmentDTO) {
    const { grade, id } = dto;
    const studentAssignment = await this.db.assignments.getStudentAssignment(
      id
    );

    if (!studentAssignment) {
      throw new StudentAssignmentNotFoundException();
    }

    const response = await this.db.assignments.grade(id, grade);
    return response;
  }

  async getAssignment(dto: GetAssignmentDTO) {
    const { id } = dto;

    const assignment = await this.db.assignments.getById(id);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return assignment;
  }
}

export default AssignmentService;
