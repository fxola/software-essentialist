import Database from "../../persistence";
import { CreateStudentDTO } from "./student-dto";

class StudentService {
  constructor(private db: Database) {}

  async createStudent(dto: CreateStudentDTO) {
    const response = await this.db.students.save(dto.name);
    return response;
  }
}

export default StudentService;
