import { ClassroomBuilder } from "./classroom-builder";
import { StudentBuilder } from "./student-builder";
import { prisma } from "../../src/database";

export class StudentEnrollmentBuilder {
  private classroomBuilder?: ClassroomBuilder;
  private studentBuilder?: StudentBuilder;

  constructor() {}

  from(builder: ClassroomBuilder) {
    this.classroomBuilder = builder;
    return this;
  }

  and(builder: StudentBuilder) {
    this.studentBuilder = builder;
    return this;
  }

  async build() {
    if (!this.classroomBuilder) {
      throw new Error("A class room is required to enroll a student");
    }

    if (!this.studentBuilder) {
      throw new Error("A Student is required to create enrollment");
    }

    const classroom = await this.classroomBuilder.build();
    const student = await this.studentBuilder.build();

    const classEnrollment = await prisma.classEnrollment.upsert({
      where: {
        studentId_classId: {
          studentId: student.id,
          classId: classroom.id,
        },
      },
      update: {
        studentId: student.id,
        classId: classroom.id,
      },
      create: {
        studentId: student.id,
        classId: classroom.id,
      },
    });

    return classEnrollment;
  }
}
