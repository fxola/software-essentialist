import Database from "../../persistence";
import { StudentNotFoundException } from "../../shared/exceptions";
import { CreateStudentDTO, GetStudentDTO } from "./student-dto";

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
}

export default StudentService;
