import { prisma } from "../../src/database";
import { Student } from "@prisma/client";

export class StudentBuilder {
  private student: Partial<Student>;

  constructor() {
    this.student = {};
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

    const student = await prisma.student.create({
      data: {
        name: this.student.name,
        email: this.student.email,
      },
    });

    return student;
  }
}
