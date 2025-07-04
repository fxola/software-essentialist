import Database from "../../persistence";
import {
  AssignmentNotFoundException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import {
  CreateStudentDTO,
  GetStudentAssignmentsDTO,
  GetStudentDTO,
  GiveStudentAssignmentDTO,
} from "./student-dto";

class StudentService {
  constructor(private db: Database) {}

  async createStudent(dto: CreateStudentDTO) {
    const result = await this.db.students.save(dto.name);
    return result;
  }

  async getAllstudents() {
    const result = await this.db.students.getAll();
    return result;
  }

  async getStudent(dto: GetStudentDTO) {
    const { id } = dto;

    const student = await this.db.students.getById(id);
    if (!student) {
      throw new StudentNotFoundException();
    }

    return student;
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

    const studentAssignment = await this.db.students.giveAssignment(
      studentId,
      assignmentId
    );

    return studentAssignment;
  }

  async getStudentAssignments(dto: GetStudentAssignmentsDTO) {
    const { studentId } = dto;

    const student = await this.db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignments = await this.db.students.getAllAssignments(studentId);

    return assignments;
  }

  async getAllGrades(dto: GetStudentAssignmentsDTO) {
    const { studentId } = dto;

    const student = await this.db.students.getById(studentId);
    if (!student) {
      throw new StudentNotFoundException();
    }

    const assignments = await this.db.students.getAllGrades(studentId);

    return assignments;
  }
}

export default StudentService;
