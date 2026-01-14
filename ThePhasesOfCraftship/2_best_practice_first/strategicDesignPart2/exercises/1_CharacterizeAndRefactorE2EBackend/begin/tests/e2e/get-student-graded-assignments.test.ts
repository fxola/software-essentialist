import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { StudentBuilder } from "../fixtures/student-builder";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { StudentEnrollmentBuilder } from "../fixtures/student-enrollment-builder";
import { StudentAssignmentBuilder } from "../fixtures/student-assignment-builder";
import { AssignmentBuilder } from "../fixtures/assignment-builder";
import { GradeAssignmentBuilder } from "../fixtures/grade-assignment-builder";
import { SubmittedAssignmentBuilder } from "../fixtures/submitted-assignment-builder";
import { GradedAssignment } from "@prisma/client";
import { app, Errors } from "../../src";
import { randomUUID } from "crypto";

const feature = loadFeature(
  path.join(__dirname, "../features/get-student-graded-assignments.feature")
);

defineFeature(feature, (test) => {
  const sortFn = (a: GradedAssignment, b: GradedAssignment) =>
    a.assignmentSubmissionId.localeCompare(b.assignmentSubmissionId);

  test("Successfully fetch all graded assignments", ({ given, when, then }) => {
    let gradedAssignments: GradedAssignment[];
    let studentId: string;
    let response: any = {};

    given("a student whose assignments has been graded exists", async () => {
      const student = new StudentBuilder();
      const classroom = new ClassroomBuilder();

      const enrollment = new StudentEnrollmentBuilder()
        .from(classroom)
        .and(student);

      const assignmentOne = new StudentAssignmentBuilder()
        .from(enrollment)
        .and(new AssignmentBuilder().withClassRoom(classroom));

      const assignmentTwo = new StudentAssignmentBuilder()
        .from(enrollment)
        .and(new AssignmentBuilder().withClassRoom(classroom));

      const submittedAssignmentOne = new SubmittedAssignmentBuilder().from(
        assignmentOne
      );

      const submittedAssignmentTwo = new SubmittedAssignmentBuilder().from(
        assignmentTwo
      );

      const { studentAssignment, gradedAssignment: gradedAssignmentOne } =
        await new GradeAssignmentBuilder()
          .from(submittedAssignmentOne)
          .withGrade("B")
          .build();

      const { gradedAssignment: gradedAssignmentTwo } =
        await new GradeAssignmentBuilder()
          .from(submittedAssignmentTwo)
          .withGrade("A")
          .build();

      studentId = studentAssignment.studentId;
      gradedAssignments = [gradedAssignmentOne, gradedAssignmentTwo].sort(
        sortFn
      );
    });

    when("I request all graded assignments for the student", async () => {
      response = await request(app).get(`/student/${studentId}/grades`);
    });

    then("I should get a list of all grades for the student", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      const sortedAGradesResponse = response.body.data.sort(sortFn);

      expect(sortedAGradesResponse).toMatchObject(gradedAssignments);
      sortedAGradesResponse.forEach((item: GradedAssignment) => {
        expect(item).toHaveProperty("grade");
        expect(item).toHaveProperty("assignmentSubmission");
      });
    });
  });

  test("Fail to fetch graded assignments for a student that does not exist", ({
    when,
    then,
  }) => {
    let response: any = {};
    when(
      "I request all graded assignments for a non-existent student",
      async () => {
        const nonExistentstudentId = randomUUID();

        response = await request(app).get(
          `/student/${nonExistentstudentId}/grades`
        );
      }
    );

    then("I should not get a list of grades", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.StudentNotFound);
      expect(response.body.data).toBeUndefined();
    });
  });
});
