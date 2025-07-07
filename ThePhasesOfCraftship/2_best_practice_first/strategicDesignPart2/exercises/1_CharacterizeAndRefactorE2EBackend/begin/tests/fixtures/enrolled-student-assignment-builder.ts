import { StudentEnrollmentBuilder } from "./student-enrollment-builder";
import { AssignmentBuilder } from "./assignment-builder";
import { prisma } from "../../src/database";

export class EnrolledStudentAssignmentBuilder {
  private studentEnrollmentBuilder?: StudentEnrollmentBuilder;
  private assignmentBuilder?: AssignmentBuilder;

  constructor() {}

  from(studentEnrollmentBuilder: StudentEnrollmentBuilder) {
    this.studentEnrollmentBuilder = studentEnrollmentBuilder;
    return this;
  }

  and(assignmentBuilder: AssignmentBuilder) {
    this.assignmentBuilder = assignmentBuilder;
    return this;
  }

  async build() {
    if (!this.assignmentBuilder) {
      throw new Error(
        "Assignment builder is required to create an enrolled student assignment"
      );
    }

    if (!this.studentEnrollmentBuilder) {
      throw new Error(
        "Class enrollment builder is required to create an enrolled student assignment"
      );
    }

    const enrollment = await this.studentEnrollmentBuilder.build();
    const assignment = await this.assignmentBuilder.build();

    const studentAssignment = await prisma.studentAssignment.create({
      data: {
        studentId: enrollment.studentId,
        assignmentId: assignment.id,
      },
    });

    return studentAssignment;
  }
}
