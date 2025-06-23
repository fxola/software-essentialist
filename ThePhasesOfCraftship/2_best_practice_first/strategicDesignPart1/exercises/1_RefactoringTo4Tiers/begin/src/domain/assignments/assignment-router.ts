import { Router } from "express";
import { AssigmentController } from "./assignment-controller";
import { ErrorHandler } from "../../shared/errors";

function assignmentRouter(
  controller: AssigmentController,
  errorHandler: ErrorHandler
) {
  const router = Router();

  router.post("/", controller.createAssignment);

  router.use(errorHandler);

  return { router };
}

export type AssignmentRouter = ReturnType<typeof assignmentRouter>;
