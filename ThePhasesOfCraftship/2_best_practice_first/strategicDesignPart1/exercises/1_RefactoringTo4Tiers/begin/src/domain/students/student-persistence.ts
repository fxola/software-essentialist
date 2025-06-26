import { PrismaClient } from "@prisma/client";

function studentPersistence(db: PrismaClient) {
  const create = async (name: string) => {
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

  const giveAssignment = async (studentId: string, assignmentId: string) => {
    return await db.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });
  };

  const build = () => {
    return {
      create,
      getById,
      giveAssignment,
    };
  };

  return build();
}

export type StudentPersistence = ReturnType<typeof studentPersistence>;
