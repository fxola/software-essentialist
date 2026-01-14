import { Class } from "@prisma/client";
import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";

export class ClassroomBuilder {
  private classroom: Partial<Class>;

  constructor() {
    this.classroom = {
      name: faker.company.name(),
    };
  }

  withName(name: string) {
    this.classroom.name = name;
    return this;
  }

  getClassroom() {
    return this.classroom;
  }

  async build() {
    const name = this.classroom.name;

    if (!name) {
      throw new Error("You need a name to create a classroom");
    }

    return await prisma.class.upsert({
      where: { name },
      create: { name },
      update: { name },
    });
  }
}
