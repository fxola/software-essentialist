import Database from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentAssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import {
  GradeStudentAssignmentDTO,
  SaveAssignmentDTO,
  GiveStudentAssignmentDTO,
  SubmitAssignmentDTO,
} from "./assignment-dto";

class AssignmentService {
  constructor(private db: Database) {}

  async saveAssignment(dto: SaveAssignmentDTO) {
    const { classId, title } = dto;

    const result = await this.db.assignments.save(classId, title);

    return result;
  }

  async giveStudentAssignment(dto: GiveStudentAssignmentDTO) {
    const { studentId, assignmentId } = dto;

    const student = await this.db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignment = await this.db.assignments.getById(assignmentId);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    const studentAssignment = await this.db.assignments.giveStudent(
      studentId,
      assignmentId
    );

    return studentAssignment;
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
}

export default AssignmentService;
