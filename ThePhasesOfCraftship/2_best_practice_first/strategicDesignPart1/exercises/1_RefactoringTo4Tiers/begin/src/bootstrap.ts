import { PrismaClient } from "@prisma/client";
import StudentService from "./modules/students/student-service";
import Database from "./persistence";
import AssignmentService from "./modules/assignments/assignment-service";
import ClassService from "./modules/classes/class-service";
import { StudentController } from "./modules/students/student-controller";
import { ErrorExceptionHandler } from "./shared/errors";
import { AssignmentController } from "./modules/assignments/assignment-controller";
import { ClassController } from "./modules/classes/class-controller";
import { Application } from "./application";
import { Routes } from "./routes";

const prisma = new PrismaClient();
const db = new Database(prisma);

const errorHandler = new ErrorExceptionHandler();

const studentService = new StudentService(db);
const assignmentService = new AssignmentService(db);
const classService = new ClassService(db);

const studentController = new StudentController(studentService, errorHandler);
const assignmentController = new AssignmentController(
  assignmentService,
  errorHandler
);

const classController = new ClassController(classService, errorHandler);

const routes = new Routes(
  studentController,
  classController,
  assignmentController
);

const application = new Application(routes);

export default application;
