import { PrismaClient } from "@prisma/client";

function classPersistence(db: PrismaClient) {
  const create = async (name: string) => {
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

  const createEnrollment = async (classId: string, studentId: string) => {
    return await db.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  };

  const getAssignments = async (id: string) => {
    return await db.assignment.findMany({
      where: { classId: id },
      include: { class: true, studentTasks: true },
    });
  };

  const build = () => {
    return {
      create,
      getById,
      getEnrollment,
      createEnrollment,
      getAssignments,
    };
  };

  return build();
}

export type ClassPersistence = ReturnType<typeof classPersistence>;
