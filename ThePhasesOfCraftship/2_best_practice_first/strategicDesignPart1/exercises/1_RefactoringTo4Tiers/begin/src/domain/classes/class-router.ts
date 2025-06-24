import { Router } from "express";
import { ClassController } from "./class-controller";
import { ErrorHandler } from "../../shared/errors";

function classRouter(controller: ClassController, errorHandler: ErrorHandler) {
  const router = Router();

  router.post("/", controller.createClass);
  router.post("/enrollment", controller.createEnrollment);

  router.use(errorHandler);

  return { router };
}

export type ClassRouter = ReturnType<typeof classRouter>;
