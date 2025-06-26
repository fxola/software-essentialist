import { PrismaClient } from "@prisma/client";

function studentPersistence(db: PrismaClient) {
  const create = async (name: string) => {
    const student = await db.student.create({
      data: { name },
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
      data: { studentId, assignmentId },
    });
  };

  const getAll = async () => {
    return await db.student.findMany({
      include: { classes: true, assignments: true, reportCards: true },
      orderBy: { name: "asc" },
    });
  };

  const getOne = async (id: string) => {
    return await db.student.findUnique({
      where: { id },
      include: { classes: true, assignments: true, reportCards: true },
    });
  };

  return {
    create,
    getAll,
    getOne,
    getById,
    giveAssignment,
  };
}

export type StudentPersistence = ReturnType<typeof studentPersistence>;
