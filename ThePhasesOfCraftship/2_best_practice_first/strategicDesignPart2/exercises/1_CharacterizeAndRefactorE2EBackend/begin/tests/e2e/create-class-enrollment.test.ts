import { loadFeature, defineFeature } from "jest-cucumber";
import path from "path";
import request from "supertest";
import { StudentBuilder } from "../fixtures/student-builder";
import { Class, ClassEnrollment, Student } from "@prisma/client";
import { ClassroomBuilder } from "../fixtures/classroom-builder";
import { StudentEnrollmentBuilder } from "../fixtures/student-enrollment-builder";
import { app, Errors } from "../../src";
import { resetDatabase } from "../fixtures/reset";
import { randomUUID } from "crypto";

const feature = loadFeature(
  path.join(__dirname, "../features/create-class-enrollment.feature")
);

defineFeature(feature, (test) => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test("Sucessfully enroll student to class", ({ given, when, then }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: Partial<Student>;
    let classroom: Partial<Class>;

    given("a student and class exists", async () => {
      student = await new StudentBuilder().build();
      classroom = await new ClassroomBuilder().build();
    });

    when("I want to enroll the student to the class", async () => {
      requestBody = {
        studentId: student.id,
        classId: classroom.id,
      };

      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should be created successfully", () => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBeTruthy();
      expect(response.body.data).toHaveProperty("studentId", student.id);
      expect(response.body.data).toHaveProperty("classId", classroom.id);
    });
  });

  test("Fail to create an enrollment when student is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let classroom: Partial<Class>;

    given("a class exists", async () => {
      classroom = await new ClassroomBuilder().build();
    });

    when("I want to create an enrollment without a student", async () => {
      requestBody = {
        classId: classroom.id,
      };

      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });

  test("Fail to create an enrollment when class detail is not provided", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: Partial<Student>;

    given("a student exists", async () => {
      student = await new StudentBuilder().build();
    });

    when("I want to create an enrollment without a class", async () => {
      requestBody = {
        studentId: student.id,
      };

      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should not be created", () => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ValidationError);
    });
  });

  test("Fail to create an enrollment when enrollment already exists", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let classEnrollment: Partial<ClassEnrollment>;

    given("an enrollment exists", async () => {
      const classroom = new ClassroomBuilder();
      const student = new StudentBuilder();

      classEnrollment = await new StudentEnrollmentBuilder()
        .from(classroom)
        .and(student)
        .build();
    });

    when("I want to enroll the same student to the same class", async () => {
      requestBody = {
        studentId: classEnrollment.studentId,
        classId: classEnrollment.classId,
      };

      response = await request(app)
        .post("/class-enrollments")
        .send(requestBody);
    });

    then("the enrollment should not be created", () => {
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.StudentAlreadyEnrolled);
    });
  });

  test("Fail to create an enrollment when class does not exist", ({
    given,
    when,
    then,
  }) => {
    let requestBody: any = {};
    let response: any = {};
    let student: Partial<Student>;

    given("a student exists", async () => {
      student = await new StudentBuilder().build();
    });

    when(
      "I want to enroll the student to a class that does not exist",
      async () => {
        requestBody = {
          studentId: student.id,
          classId: randomUUID(),
        };

        response = await request(app)
          .post("/class-enrollments")
          .send(requestBody);
      }
    );

    then("the enrollment should not be created", () => {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("success");
      expect(response.body.success).toBeFalsy();
      expect(response.body.data).toBeUndefined();
      expect(response.body.error).toBe(Errors.ClassNotFound);
    });
  });
});
