import { Router } from "express";
import { AssignmentController } from "./modules/assignments/assignment-controller";
import { ClassController } from "./modules/classes/class-controller";
import { StudentController } from "./modules/students/student-controller";

export class Routes {
  private router: Router;

  constructor(
    private studentController: StudentController,
    private classController: ClassController,
    private assignmentController: AssignmentController
  ) {
    this.router = Router();
    this.assembleRoutes();
  }

  private assembleRoutes() {
    this.router.use("/students", this.studentController.getRouter());
    this.router.use("/classes", this.classController.getRouter());
    this.router.use("/assignments", this.assignmentController.getRouter());
  }

  public getRouter() {
    return this.router;
  }
}
