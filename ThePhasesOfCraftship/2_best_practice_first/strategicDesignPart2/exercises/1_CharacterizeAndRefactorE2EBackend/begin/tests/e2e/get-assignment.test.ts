import { Assignment } from "@prisma/client";
import request from "supertest";
import { defineFeature, loadFeature } from "jest-cucumber";
import path from "path";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";
import { anAssignment } from "../fixtures";

const feature = loadFeature(
  path.join(__dirname, "../features/get-assignment.feature")
);

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await resetDatabase();
  });

  test("Successfully fetch an assignment", ({ given, when, then }) => {
    let assignment: Assignment;
    let response: any = {};

    given("an assignment exists", async () => {
      assignment = await anAssignment();
    });

    when("I request the assignment", async () => {
      response = await request(app).get(`/assignments/${assignment.id}`);
    });

    then("I should successfully get the assignment details", () => {
      expect(response.status).toBe(200);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toMatchObject(assignment);
    });
  });

  test("Fail to fetch an assignment that does not exist", ({ when, then }) => {
    let response: any = {};
    when("I try to get an assignment that does not exist", async () => {
      response = await request(app).get(`/assignments/${randomUUID()}`);
    });

    then("I should not get any assignment details", () => {
      expect(response.status).toBe(404);
      expect(response.body.success).toBeFalsy();
      expect(response.body.error).toBe(Errors.AssignmentNotFound);
      expect(response.body.data).toBeUndefined();
    });
  });
});
