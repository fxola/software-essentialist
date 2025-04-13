import Database from "../../persistence";
import {
  AssignmentNotFoundException,
  ClassNotFoundException,
  StudentAssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import {
  GradeStudentAssignmentDTO,
  SaveAssignmentDTO,
  GiveStudentAssignmentDTO,
  SubmitAssignmentDTO,
  GetAssignmentDTO,
  GetAllAssignmentsDTO,
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

  async getAssignment(dto: GetAssignmentDTO) {
    const { id } = dto;

    const assignment = await this.db.assignments.getById(id);
    if (!assignment) {
      throw new AssignmentNotFoundException();
    }

    return assignment;
  }

  async getAllAssignments(dto: GetAllAssignmentsDTO) {
    const { classId } = dto;
    const classResult = await this.db.classrooms.getById(classId);

    if (!classResult) {
      throw new ClassNotFoundException(classId);
    }

    const assignments = await this.db.assignments.getAllAssignments(classId);
    return assignments;
  }
}

export default AssignmentService;
