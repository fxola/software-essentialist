import { prisma } from "../../src/database";
import { SubmittedAssignmentBuilder } from "./submitted-assignment-builder";

export class GradeAssignmentBuilder {
  private submitAssignmentBuilder?: SubmittedAssignmentBuilder;
  private grade?: string;

  from(submitAssignmentBuilder: SubmittedAssignmentBuilder) {
    this.submitAssignmentBuilder = submitAssignmentBuilder;
    return this;
  }

  withGrade(grade: string) {
    this.grade = grade;
    return this;
  }

  async build() {
    if (!this.submitAssignmentBuilder) {
      throw new Error("Submitted Assignment builder is required");
    }

    if (!this.grade) {
      throw new Error("You need to provide a grade");
    }

    const { submittedAssignment, studentAssignment } =
      await this.submitAssignmentBuilder.build();

    const gradedAssignment = await prisma.gradedAssignment.create({
      data: {
        grade: this.grade,
        assignmentSubmissionId: submittedAssignment.id,
      },
    });

    return { gradedAssignment, studentAssignment };
  }
}
