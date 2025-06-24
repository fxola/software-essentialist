import { PrismaClient } from "@prisma/client";

function classPersistence(db: PrismaClient) {
  const save = async (name: string) => {
    const result = await db.class.create({
      data: {
        name,
      },
    });

    return result;
  };

  const getById = async (classId: string) => {
    return await db.class.findUnique({
      where: {
        id: classId,
      },
    });
  };

  const getEnrollment = async (classId: string, studentId: string) => {
    return await db.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });
  };

  const saveEnrollment = async (classId: string, studentId: string) => {
    return await db.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  };

  const build = () => {
    return {
      save,
      getById,
      getEnrollment,
      saveEnrollment,
    };
  };

  return build();
}

export type ClassPersistence = ReturnType<typeof classPersistence>;
