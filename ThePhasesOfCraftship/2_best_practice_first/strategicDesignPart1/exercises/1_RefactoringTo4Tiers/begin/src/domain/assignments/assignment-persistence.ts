import { PrismaClient } from "@prisma/client";

export function assignmentPersistence(db: PrismaClient) {
  const save = async (classId: string, title: string) => {
    return await db.assignment.create({
      data: {
        classId,
        title,
      },
    });
  };

  const build = () => {
    return {
      save,
    };
  };

  return build();
}

export type AssignmentPersistence = ReturnType<typeof assignmentPersistence>;
