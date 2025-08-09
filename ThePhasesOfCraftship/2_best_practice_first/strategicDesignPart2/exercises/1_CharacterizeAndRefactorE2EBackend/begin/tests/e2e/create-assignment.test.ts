import { loadFeature, defineFeature } from "jest-cucumber";
import request from "supertest";
import path from "path";
import { AssignmentBuilder } from "../fixtures/assignment-builder";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { app, Errors } from "../../src";
import { Assignment, Class } from "@prisma/client";

const featurePath = path.join(
  __dirname,
  "../features/create-assignment.feature"
);

const feature = loadFeature(featurePath);

defineFeature(feature, (test) => {
  test("Sucessfully create an assignment", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let classroom: ClassroomBuilder;
    let assignment: Partial<Assignment>;

    given(/^a "(.*)" class exists$/, async (name) => {
      classroom = new ClassroomBuilder().withName(name);
    });

    when(/^I want to create an assignment titled "(.*)"$/, async (title) => {
      assignment = await new AssignmentBuilder()
        .withClassRoom(classroom)
        .withTitle(title)
        .build();

      requestBody = {
        classId: assignment.classId,
        title: assignment.title,
      };

      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment should be created successfully", async () => {
      expect(response.status).toBe(201);
      expect(response.body.error).toBeUndefined();
      expect(response.body.success).toBeTruthy();
      expect(response.body.data.title).toBe(assignment.title);
      expect(response.body.data.classId).toBe(assignment.classId);
    });
  });

  test("Fail to create an assignment when title is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let classroom: Partial<Class>;

    given(/^a "(.*)" class exists$/, async (name) => {
      classroom = await new ClassroomBuilder().withName(name).build();
    });

    when("I want to create an assignment with no title", async () => {
      requestBody = {
        classId: classroom.name,
      };

      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });

  test("Fail to create an assignment when class detail is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any;
    let response: any = {};

    given("a class does not exist", () => {
      requestBody = {};
    });

    when(/^I want to create an assignment titled "(.*)"$/, async (title) => {
      requestBody = {
        title,
      };

      response = await request(app).post("/assignments").send(requestBody);
    });

    then("the assignment should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });
});
