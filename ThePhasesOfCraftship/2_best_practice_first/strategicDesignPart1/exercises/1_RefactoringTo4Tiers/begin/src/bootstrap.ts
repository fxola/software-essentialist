import { PrismaClient } from "@prisma/client";
import StudentService from "./domain/students/student-service";
import Database from "./persistence";
import AssignmentService from "./domain/assignments/assignment-service";
import ClassService from "./domain/classes/class-service";
import { StudentController } from "./domain/students/student-controller";
import { ErrorExceptionHandler } from "./shared/errors";
import { AssignmentController } from "./domain/assignments/assignment-controller";
import { ClassController } from "./domain/classes/class-controller";
import { Application } from "./application";

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

const application = new Application(
  assignmentController,
  classController,
  studentController
);

export default application;
