import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { StudentBuilder } from "../fixtures/student-builder";
import { prisma } from "../../src/database";

export class ClassEnrollmentBuilder {
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

    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId: student.id,
        classId: classroom.id,
      },
    });

    return classEnrollment;
  }
}
