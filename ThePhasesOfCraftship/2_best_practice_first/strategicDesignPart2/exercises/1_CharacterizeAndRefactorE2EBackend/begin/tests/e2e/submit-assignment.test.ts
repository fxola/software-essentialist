import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { ClassEnrollment, StudentAssignment } from "@prisma/client";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";
import {
  anEnrollment,
  aStudentAssignment,
  aSubmittedAssignment,
} from "../fixtures";

const feature = loadFeature(
  path.join(__dirname, "../features/submit-student-assignment.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("Sucessfully submit an assignment", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let studentAssignment: Partial<StudentAssignment>;

    given(
      "I am an enrolled student and I have been assigned an assignment",
      async () => {
        studentAssignment = await aStudentAssignment();
      }
    );

    when("I want to submit an assignment", async () => {
      const { studentId, assignmentId } = studentAssignment;

      requestBody = {
        studentId,
        assignmentId,
      };

      response = await request(app)
        .post("/student-assignments/submit")
        .send(requestBody);
    });

    then("the assignment should be submitted successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("studentAssignmentId");
      expect(response.body.data).toHaveProperty("submissionContent");
    });
  });

  test("Fail to submit an assignment when it does not exist", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let enrolledStudent: Partial<ClassEnrollment>;

    given("I am an enrolled student", async () => {
      enrolledStudent = await anEnrollment();
    });

    when("I want to submit an assignment that does not exist", async () => {
      const { studentId } = enrolledStudent;

      requestBody = {
        studentId,
        assignmentId: randomUUID(),
      };

      response = await request(app)
        .post("/student-assignments/submit")
        .send(requestBody);
    });

    then("the assignment should not be submitted", () => {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.AssignmentNotFound);
    });
  });

  test("Fail to submit an assignment when it has been previously submitted", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let studentAssignment: Partial<StudentAssignment>;

    given("I am an enrolled student with a submitted assignment", async () => {
      const submittedAssignment = await aSubmittedAssignment();

      studentAssignment = submittedAssignment.studentAssignment;
    });

    when("I want to submit the same assignment again", async () => {
      requestBody = {
        studentId: studentAssignment.studentId,
        assignmentId: studentAssignment.assignmentId,
      };

      response = await request(app)
        .post("/student-assignments/submit")
        .send(requestBody);
    });

    then("the assignment should not be submitted", () => {
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.AssignmentAlreadySubmitted);
    });
  });
});
