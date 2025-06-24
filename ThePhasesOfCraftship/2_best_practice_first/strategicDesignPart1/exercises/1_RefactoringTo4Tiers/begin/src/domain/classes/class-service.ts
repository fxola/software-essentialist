import { Database } from "../../persistence";
import { ClassDTO } from "./class-dto";

function classService(db: Database) {
  const save = async (dto: ReturnType<ClassDTO["forCreate"]>) => {
    return await db.classes.save(dto.name);
  };

  return { save };
}

export type ClassService = ReturnType<typeof classService>;
