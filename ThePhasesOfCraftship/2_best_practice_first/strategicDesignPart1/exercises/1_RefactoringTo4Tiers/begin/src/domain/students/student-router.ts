import { Router } from "express";
import { StudentController } from "./student-controller";
import { ErrorHandler } from "../../shared/errors";

function studentRouter(
  controller: StudentController,
  errorHandler: ErrorHandler
) {
  const router = Router();

  router.get("/", controller.getAllStudents);
  router.get("/:id", controller.getStudent);
  router.get("/:id/assignments", controller.getSubmittedAssignments);
  router.post("/", controller.createStudent);
  router.post("/assignments", controller.giveAssignment);

  router.use(errorHandler);

  return { router };
}

export type StudentRouter = ReturnType<typeof studentRouter>;
