import { PrismaClient } from "@prisma/client";

function assignmentPersistence(db: PrismaClient) {
  const create = async (classId: string, title: string) => {
    return await db.assignment.create({
      data: {
        classId,
        title,
      },
    });
  };

  const getById = async (assignmentId: string) => {
    return await db.assignment.findUnique({
      where: {
        id: assignmentId,
      },
    });
  };

  const submit = async (id: string) => {
    return await db.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });
  };

  const build = () => {
    return {
      create,
      submit,
      getById,
    };
  };

  return build();
}

export type AssignmentPersistence = ReturnType<typeof assignmentPersistence>;
