import { Router } from "express";
import { AssignmentRouter } from "./domain/assignments/assignment-router";
import { StudentRouter } from "./domain/students/student-router";

export function routes(
  assignmentRoutes: AssignmentRouter,
  studentRoutes: StudentRouter
) {
  const routes = Router();

  routes.use("/assignments", assignmentRoutes.router);
  routes.use("/students", studentRoutes.router);
}
