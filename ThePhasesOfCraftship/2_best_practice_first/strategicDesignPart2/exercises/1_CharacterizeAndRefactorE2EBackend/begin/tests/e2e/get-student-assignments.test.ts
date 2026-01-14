import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { AssignmentBuilder } from "../fixtures/assignment-builder";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { StudentAssignment } from "@prisma/client";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";
import { StudentAssignmentBuilder } from "../fixtures/student-assignment-builder";
import { StudentEnrollmentBuilder } from "../fixtures/student-enrollment-builder";
import { StudentBuilder } from "../fixtures/student-builder";

const feature = loadFeature(
  path.join(__dirname, "../features/get-student-assignments.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test("Successfully fetch all assignments", ({ given, when, then }) => {
    let assignments: StudentAssignment[];
    let response: any = {};

    const sortFn = (a: StudentAssignment, b: StudentAssignment) =>
      a.assignmentId.localeCompare(b.assignmentId);

    given("a student that has been given assignments exists", async () => {
      const student = new StudentBuilder();
      const classroom = new ClassroomBuilder();

      const enrollment = new StudentEnrollmentBuilder()
        .from(classroom)
        .and(student);

      const assignmentOne = await new StudentAssignmentBuilder()
        .from(enrollment)
        .and(new AssignmentBuilder().withClassRoom(classroom))
        .build();

      const assignmentTwo = await new StudentAssignmentBuilder()
        .from(enrollment)
        .and(new AssignmentBuilder().withClassRoom(classroom))
        .build();

      assignments = [assignmentOne, assignmentTwo].sort(sortFn);
    });

    when("I request all assignments for the student", async () => {
      const studentId = assignments[0].studentId;
      response = await request(app).get(`/student/${studentId}/assignments`);
    });

    then("I should get a list of all assignments for the student", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data.length).toBe(assignments.length);

      const sortedAssignmentResponse = response.body.data.sort(sortFn);

      expect(sortedAssignmentResponse).toMatchObject(assignments);
    });
  });

  test("Fail to fetch assignments for a student that does not exist", ({
    when,
    then,
  }) => {
    let response: any = {};
    when("I request all assignments for a non-existent student", async () => {
      const studentId = randomUUID();
      response = await request(app).get(`/student/${studentId}/assignments`);
    });

    then("I should not get a list of assignments", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.StudentNotFound);
      expect(response.body.data).toBeUndefined();
    });
  });
});
