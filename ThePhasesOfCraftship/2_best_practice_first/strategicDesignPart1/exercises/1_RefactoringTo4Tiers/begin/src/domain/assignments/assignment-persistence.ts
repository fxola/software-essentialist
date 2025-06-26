import { PrismaClient } from "@prisma/client";

function assignmentPersistence(db: PrismaClient) {
  const create = async (classId: string, title: string) => {
    return await db.assignment.create({
      data: { classId, title },
    });
  };

  const getById = async (assignmentId: string) => {
    return await db.assignment.findUnique({
      where: { id: assignmentId },
    });
  };

  const submit = async (id: string) => {
    return await db.studentAssignment.update({
      where: { id },
      data: { status: "submitted" },
    });
  };

  const grade = async (id: string, grade: string) => {
    return await db.studentAssignment.update({
      where: { id },
      data: { grade },
    });
  };

  const getOne = async (id: string) => {
    return await db.assignment.findUnique({
      include: { class: true, studentTasks: true },
      where: { id },
    });
  };

  return {
    grade,
    create,
    submit,
    getOne,
    getById,
  };
}

export type AssignmentPersistence = ReturnType<typeof assignmentPersistence>;
