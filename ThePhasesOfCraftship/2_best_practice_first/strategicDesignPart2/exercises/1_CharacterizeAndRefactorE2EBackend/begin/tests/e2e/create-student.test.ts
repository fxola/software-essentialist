import { loadFeature, defineFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";

const featurePath = path.join(__dirname, "../features/create-student.feature");
const feature = loadFeature(featurePath);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test("Sucessfully create a student", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    given(
      /^I want to create a class room named "(.*)" with email "(.*)"$/,
      (name, email) => {
        requestBody = { name, email };
      }
    );

    when("I send a request to create a student", async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then("the student should be created successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toHaveProperty("name", requestBody.name);
      expect(response.body.data).toHaveProperty("email", requestBody.email);
    });
  });

  test("Fail to create a student when name is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    given(
      /^I want to create a student with no name but with email "(.*)"$/,
      (email) => {
        requestBody = { email };
      }
    );

    when("I send a request to create a student", async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then("the student should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });

  test("Fail to create a student when email is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    given(
      /^I want to create a student with no email, but with name "(.*)"$/,
      (name) => {
        requestBody = { name };
      }
    );

    when("I send a request to create a student", async () => {
      response = await request(app).post("/students").send(requestBody);
    });

    then("the student should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });
});
