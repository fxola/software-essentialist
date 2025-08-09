import { Student } from "@prisma/client";
import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";
import { aStudent } from "../fixtures";

const feature = loadFeature(
  path.join(__dirname, "../features/get-student.feature")
);

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await resetDatabase();
  });

  test("Successfully fetch one student", ({ given, when, then }) => {
    let student: Student;
    let response: any = {};

    given("a student exists", async () => {
      student = await aStudent();
    });

    when("I request the student", async () => {
      response = await request(app).get(`/students/${student.id}`);
    });

    then("I should successfully get the student details", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toMatchObject(student);
    });
  });

  test("Fail to fetch a student that does not exist", ({ when, then }) => {
    let response: any = {};
    when("I try to get a student that does not exist", async () => {
      response = await request(app).get(`/students/${randomUUID()}`);
    });

    then("I should not get any student details", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.StudentNotFound);
      expect(response.body.data).toBeUndefined();
    });
  });
});
