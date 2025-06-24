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

  const build = () => {
    return {
      save,
    };
  };

  return build();
}

export type ClassPersistence = ReturnType<typeof classPersistence>;
