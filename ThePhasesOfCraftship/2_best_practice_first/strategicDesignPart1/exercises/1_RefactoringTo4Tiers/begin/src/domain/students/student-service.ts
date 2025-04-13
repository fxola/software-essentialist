import Database from "../../persistence";
import { CreateStudentDTO } from "./student-dto";

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
}

export default StudentService;
