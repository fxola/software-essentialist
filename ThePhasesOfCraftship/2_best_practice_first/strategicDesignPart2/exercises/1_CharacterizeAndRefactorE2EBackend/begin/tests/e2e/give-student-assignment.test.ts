import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { StudentBuilder } from "../fixtures/student-builder";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { StudentEnrollmentBuilder } from "../fixtures/student-enrollment-builder";
import { AssignmentBuilder } from "../fixtures/assignment-builder";
import {
  Assignment,
  ClassEnrollment,
  Student,
  StudentAssignment,
} from "@prisma/client";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";
import {
  anAssignment,
  anEnrollment,
  aStudent,
  aStudentAssignment,
} from "../fixtures";

const feature = loadFeature(
  path.join(__dirname, "../features/give-student-assignment.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test("Sucessfully assign an assignment to a student", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let enrollment: Partial<ClassEnrollment>;
    let assignment: Partial<Assignment>;

    given("an enrolled student and an assignment exists", async () => {
      const classroom = new ClassroomBuilder();

      enrollment = await new StudentEnrollmentBuilder()
        .from(classroom)
        .and(new StudentBuilder())
        .build();

      assignment = await new AssignmentBuilder()
        .withClassRoom(classroom)
        .build();
    });

    when("I want to assign an assignment to the student", async () => {
      requestBody = {
        studentId: enrollment.studentId,
        assignmentId: assignment.id,
      };

      response = await request(app)
        .post("/student-assignments")
        .send(requestBody);
    });

    then(
      "the assignment should be assigned to the student successfully",
      () => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data).toHaveProperty(
          "studentId",
          enrollment.studentId
        );
        expect(response.body.data).toHaveProperty(
          "assignmentId",
          assignment.id
        );
      }
    );
  });

  test("Fail to assign an assignment to a student when the student is not enrolled", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let assignment: Partial<Assignment>;
    let student: Partial<Student>;

    given("a student is not enrolled and an assignment exists", async () => {
      student = await aStudent();
      assignment = await anAssignment();
    });

    when("I want to assign an assignment to the student", async () => {
      requestBody = {
        studentId: student.id,
        assignmentId: assignment.id,
      };

      response = await request(app)
        .post("/student-assignments")
        .send(requestBody);
    });

    then("the assignment should not be assigned to the student", () => {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.StudentNotEnrolled);
    });
  });

  test("Fail to assign an assignment to a student when the assignment does not exist", ({
    given,
    when,
    then,
  }) => {
    let enrollment: Partial<ClassEnrollment>;
    let requestBody: any = {};
    let response: any = {};

    given("an enrolled student exists", async () => {
      enrollment = await anEnrollment();
    });

    when(
      "I want to assign an assignment that does not exist to the enrolled student",
      async () => {
        requestBody = {
          studentId: enrollment.studentId,
          assignmentId: randomUUID(),
        };

        response = await request(app)
          .post("/student-assignments")
          .send(requestBody);
      }
    );

    then("the assignment should not be assigned to the student", () => {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.AssignmentNotFound);
    });
  });

  test("Fail to assign an assignment to a student when the assignment has already been assigned to the student", ({
    given,
    when,
    then,
  }) => {
    let studentAssignment: Partial<StudentAssignment>;
    let requestBody: any = {};
    let response: any = {};

    given(
      "an assignment has been assigned to an enrolled student",
      async () => {
        studentAssignment = await aStudentAssignment();
      }
    );

    when(
      "I want to assign the same assignment to the same student",
      async () => {
        requestBody = {
          studentId: studentAssignment.studentId,
          assignmentId: studentAssignment.assignmentId,
        };

        response = await request(app)
          .post("/student-assignments")
          .send(requestBody);
      }
    );

    then("the assignment should not be assigned to the student", () => {
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(
        Errors.AlreadyAssignedAssignmentToStudent
      );
    });
  });
});
