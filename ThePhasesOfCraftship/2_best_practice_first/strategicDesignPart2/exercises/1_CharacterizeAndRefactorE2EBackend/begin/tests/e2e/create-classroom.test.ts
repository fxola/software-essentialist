import { loadFeature, defineFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { app, Errors } from "../../src/index";
import { resetDatabase } from "../fixtures/reset";

const feature = loadFeature(
  path.join(__dirname, "../features/create-classroom.feature")
);

defineFeature(feature, (test) => {
  beforeAll(async () => {
    await resetDatabase();
  });

  test("Sucessfully create a class room", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    given(/^I want to create a class room named "(.*)"$/, (name) => {
      requestBody = {
        name,
      };
    });

    when("I send a request to create a class room", async () => {
      response = await request(app).post("/classes").send(requestBody);
    });

    then("the class room should be created successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data.name).toBe(requestBody.name);
    });
  });

  test("Fail to create a class room", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    given("I want to create a class room with no name", () => {
      requestBody = {};
    });

    when("I send a request to create a class room", async () => {
      response = await request(app).post("/classes").send(requestBody);
    });

    then("the class room should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });
});
