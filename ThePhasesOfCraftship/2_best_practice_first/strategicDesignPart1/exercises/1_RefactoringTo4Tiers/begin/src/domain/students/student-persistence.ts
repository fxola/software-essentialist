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

  const getById = async (studentId: string) => {
    return await db.student.findUnique({
      where: {
        id: studentId,
      },
    });
  };

  const build = () => {
    return {
      save,
      getById,
    };
  };

  return build();
}

export type StudentPersistence = ReturnType<typeof studentPersistence>;
