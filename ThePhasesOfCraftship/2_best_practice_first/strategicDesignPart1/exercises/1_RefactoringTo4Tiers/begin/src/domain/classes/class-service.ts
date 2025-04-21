import Database from "../../persistence";
import {
  ClassNotFoundException,
  StudentAlreadyEnrolledException,
  StudentNotFoundException,
} from "../../shared/exceptions";
import { CreateClassDTO, CreateClassEnrollmentDTO } from "./class-dto";

class ClassService {
  constructor(private db: Database) {}

  async createClass(dto: CreateClassDTO) {
    return await this.db.students.save(dto.name);
  }

  async createClassEnrollment(dto: CreateClassEnrollmentDTO) {
    const { studentId, classId } = dto;

    const student = await this.db.students.getById(studentId);

    if (!student) {
      throw new StudentNotFoundException();
    }

    const classResult = await this.db.classrooms.getById(classId);
    if (!classResult) {
      throw new ClassNotFoundException(classId);
    }

    const duplicatedClassEnrollment = this.db.classrooms.getEnrollment(
      studentId,
      classId
    );

    if (duplicatedClassEnrollment) {
      throw new StudentAlreadyEnrolledException();
    }

    const classEnrollment = this.db.classrooms.saveEnrollment(
      studentId,
      classId
    );

    return classEnrollment;
  }
}
export default ClassService;
