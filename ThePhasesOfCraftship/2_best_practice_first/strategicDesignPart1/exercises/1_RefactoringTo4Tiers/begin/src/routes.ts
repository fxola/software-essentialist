import { Router } from "express";
import { AssignmentRouter } from "./domain/assignments/assignment-router";
import { StudentRouter } from "./domain/students/student-router";
import { ClassRouter } from "./domain/classes/class-router";

export function routes(
  assignmentRoutes: AssignmentRouter,
  studentRoutes: StudentRouter,
  classRouter: ClassRouter
) {
  const routes = Router();

  routes.use("/assignments", assignmentRoutes.router);
  routes.use("/students", studentRoutes.router);
  routes.use("/classes", classRouter.router);

  return routes;
}
