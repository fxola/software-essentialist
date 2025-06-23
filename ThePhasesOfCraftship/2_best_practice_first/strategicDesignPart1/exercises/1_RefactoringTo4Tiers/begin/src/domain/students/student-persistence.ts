import { PrismaClient } from "@prisma/client";

function studentPersistence(db: PrismaClient) {
  const save = async (name: string) => {
    const student = await db.student.create({
      data: {
        name,
      },
    });
    return student;
  };

  const build = () => {
    return {
      save,
    };
  };

  return build();
}

export type StudentPersistence = ReturnType<typeof studentPersistence>;
