import { prisma } from "../../src/database";
import { Student } from "@prisma/client";
import { faker } from "@faker-js/faker";
export class StudentBuilder {
  private student: Partial<Student>;

  constructor() {
    this.student = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    };
  }

  withName(name: string) {
    this.student.name = name;
    return this;
  }

  withEmail(email: string) {
    this.student.email = email;
    return this;
  }

  async build() {
    if (!this.student.name) {
      throw new Error("Name is required to create student");
    }

    if (!this.student.email) {
      throw new Error("Email is required to create student");
    }

    const student = await prisma.student.upsert({
      where: {
        email: this.student.email,
      },
      update: {
        email: this.student.email,
      },
      create: {
        name: this.student.name,
        email: this.student.email,
      },
    });

    return student;
  }
}
