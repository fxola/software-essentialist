import { Database } from "../../persistence";
import { StudentDTO } from "./student-dto";

function studentService(db: Database) {
  const save = async (dto: ReturnType<StudentDTO["forCreate"]>) => {
    return await db.students.save(dto.name);
  };

  return { save };
}

export type StudentService = ReturnType<typeof studentService>;
