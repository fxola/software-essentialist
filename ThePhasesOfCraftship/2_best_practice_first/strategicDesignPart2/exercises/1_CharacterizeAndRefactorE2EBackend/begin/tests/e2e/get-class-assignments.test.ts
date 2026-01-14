import { defineFeature, loadFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { AssignmentBuilder } from "../fixtures/assignment-builder";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { Assignment } from "@prisma/client";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";

const feature = loadFeature(
  path.join(__dirname, "../features/get-class-assignments.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });
  test("Successfully fetch all assignments", ({ given, when, then }) => {
    let assignments: Assignment[];
    let response: any = {};

    given("a class with assignments exists", async () => {
      const classroom = new ClassroomBuilder().withName("JSS2 B");

      const physicsAssignment = await new AssignmentBuilder()
        .withTitle("Theoretical Physics")
        .withClassRoom(classroom)
        .build();

      const biologyAssignment = await new AssignmentBuilder()
        .withTitle("Cellular Biology")
        .withClassRoom(classroom)
        .build();

      assignments = [physicsAssignment, biologyAssignment];
    });

    when("I request all assignments for the class", async () => {
      const classID = assignments[0].classId;
      response = await request(app).get(`/classes/${classID}/assignments`);
    });

    then("I should get a list of all assignments for the class", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data.length).toBe(assignments.length);
      expect(assignments).toMatchObject(
        response.body.data.map((a: Assignment) => ({
          title: a.title,
          classId: a.classId,
        }))
      );
    });
  });

  test("Fail to fetch assignments for a class that does not exist", ({
    when,
    then,
  }) => {
    let response: any = {};
    when("I request all assignments for a non-existent class", async () => {
      const classID = randomUUID();
      response = await request(app).get(`/classes/${classID}/assignments`);
    });

    then("I should not get a list of assignments", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.ClassNotFound);
      expect(response.body.data).toBeUndefined();
    });
  });
});
