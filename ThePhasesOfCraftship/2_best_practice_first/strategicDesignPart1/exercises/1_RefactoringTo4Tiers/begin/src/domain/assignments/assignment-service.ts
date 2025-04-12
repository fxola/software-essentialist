import Database from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import { SaveAssignmentDTO, SaveStudentAssignmentDTO } from "./assignment-dto";

class AssignmentService {
  constructor(private db: Database) {}

  async saveAssignment(dto: SaveAssignmentDTO) {
    const { classId, title } = dto;

    const result = await this.db.assignments.save(classId, title);

    return result;
  }

  async saveStudentAssignment(dto: SaveStudentAssignmentDTO) {
    const { studentId, assignmentId } = dto;

    const student = await this.db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await this.db.assignments.getById(assignmentId);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    const studentAssignment = await this.db.assignments.addStudent(
      studentId,
      assignmentId
    );

    return studentAssignment;
  }
}

export default AssignmentService;
