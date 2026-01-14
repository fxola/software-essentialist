import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { app } from "../../src";
import { Student } from "@prisma/client";
import { resetDatabase } from "../fixtures/reset";
import { aStudent } from "../fixtures";

const featurePath = path.join(__dirname, "../features/get-students.feature");
const feature = loadFeature(featurePath);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test("Successfully fetch all students", ({ given, when, then }) => {
    let response: any = {};
    let students: Student[];

    given("students exist", async () => {
      const student1 = aStudent();
      const student2 = aStudent();

      students = await Promise.all([student1, student2]);
    });

    when("I request all students", async () => {
      response = await request(app).get("/students");
    });

    then("I should get a list of all students", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();

      response.body.data.forEach((student: Student) => {
        expect(student).toHaveProperty("classes");
        expect(student).toHaveProperty("assignments");
        expect(student).toHaveProperty("reportCards");

        expect(students).toContainEqual(
          expect.objectContaining({ name: student.name, email: student.email })
        );
      });
    });
  });
});
