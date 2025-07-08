import { prisma } from "../../src/database";
import { StudentAssignmentBuilder } from "./student-assignment-builder";

export class SubmittedAssignmentBuilder {
  private studentAssignmentBuilder?: StudentAssignmentBuilder;

  from(studentAssignmentBuilder: StudentAssignmentBuilder) {
    this.studentAssignmentBuilder = studentAssignmentBuilder;
    return this;
  }

  async build() {
    if (!this.studentAssignmentBuilder) {
      throw new Error(
        "You need a studentAssignmentBuilder to submit an assignment"
      );
    }

    const studentAssignment = await this.studentAssignmentBuilder.build();

    const submittedAssignment = await prisma.assignmentSubmission.create({
      data: {
        studentAssignmentId: studentAssignment.id,
      },
    });

    return { submittedAssignment, studentAssignment };
  }
}
