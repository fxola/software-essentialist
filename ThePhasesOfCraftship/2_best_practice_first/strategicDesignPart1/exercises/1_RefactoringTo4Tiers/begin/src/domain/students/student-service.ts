import { Database } from "../../persistence";
import { CreateStudentDTO } from "./student-dto";

function studentService(db: Database) {
  const save = async (dto: CreateStudentDTO) => {
    return await db.students.save(dto.name);
  };
  return { save };
}

export type StudentService = ReturnType<typeof studentService>;
