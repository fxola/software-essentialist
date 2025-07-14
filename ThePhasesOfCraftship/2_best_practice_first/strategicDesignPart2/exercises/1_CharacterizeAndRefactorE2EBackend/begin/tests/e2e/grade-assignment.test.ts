import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { aGradedAssignment, aSubmittedAssignment } from "../fixtures";
import {
  AssignmentSubmission,
  GradedAssignment,
  StudentAssignment,
} from "@prisma/client";
import { app, Errors } from "../../src";

const feature = loadFeature(
  path.join(__dirname, "../features/grade-assignment.feature")
);

defineFeature(feature, (test) => {
  test("Sucessfully grade an assignment", ({ given, when, then }) => {
    let submittedAssignment: AssignmentSubmission;
    let studentAssignment: StudentAssignment;
    let requestBody: any = {};
    let response: any = {};

    given("a student submits an assignment", async () => {
      const result = await aSubmittedAssignment();

      submittedAssignment = result.submittedAssignment;
      studentAssignment = result.studentAssignment;
    });

    when("I grade the assignment", async () => {
      const { studentId, assignmentId } = studentAssignment;

      requestBody = {
        studentId,
        assignmentId,
        grade: "A",
      };

      response = await request(app)
        .post("/student-assignments/grade")
        .send(requestBody);
    });

    then("the assignment should be graded successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("assignmentSubmissionId");
      expect(response.body.data).toHaveProperty("grade");
    });
  });

  test("Fail to grade an assignment when an invalid grade is provided", ({
    given,
    when,
    then,
  }) => {
    let submittedAssignment: AssignmentSubmission;
    let studentAssignment: StudentAssignment;
    let requestBody: any = {};
    let response: any = {};

    given("a student submits an assignment", async () => {
      const result = await aSubmittedAssignment();

      submittedAssignment = result.submittedAssignment;
      studentAssignment = result.studentAssignment;
    });

    when("I grade the assignment with an unrecognized grade", async () => {
      const { studentId, assignmentId } = studentAssignment;

      requestBody = {
        studentId,
        assignmentId,
        grade: "A very good grade",
      };

      response = await request(app)
        .post("/student-assignments/grade")
        .send(requestBody);
    });

    then("the assignment should not be graded", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });

  test("Fail to grade an assignment when it has been previously graded", ({
    given,
    when,
    then,
  }) => {
    let gradedAssignment: GradedAssignment;
    let studentAssignment: StudentAssignment;
    let requestBody: any = {};
    let response: any = {};

    given("a student submits an assignment", async () => {
      const result = await aGradedAssignment({ grade: "A" });

      gradedAssignment = result.gradedAssignment;
      studentAssignment = result.studentAssignment;
    });

    when("I try to grade the assignment that has been graded", async () => {
      const { studentId, assignmentId } = studentAssignment;

      requestBody = {
        studentId,
        assignmentId,
        grade: "B",
      };

      response = await request(app)
        .post("/student-assignments/grade")
        .send(requestBody);
    });

    then("the assignment should not be graded", () => {
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.AlreadyGradedAssignment);
    });
  });
});
