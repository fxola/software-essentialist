import { database } from "./persistence";
import { assignmentPersistence } from "./domain/assignments/assignment-persistence";
import { prisma } from "./persistence/prisma";
import { classPersistence } from "./domain/classes/class-persistence";
import { studentPersistence } from "./domain/students/student-persistence";
import { studentService } from "./domain/students/student-service";
import { assigmentService } from "./domain/assignments/assignment-service";
import { classService } from "./domain/classes/class-service";
import { studentController } from "./domain/students/student-controller";
import { studentDTO } from "./domain/students/student-dto";
import { assigmentController } from "./domain/assignments/assignment-controller";
import { assigmentDTO } from "./domain/assignments/assignment-dto";
import { classDTO } from "./domain/classes/class-dto";
import { classController } from "./domain/classes/class-controller";
import { assignmentRouter } from "./domain/assignments/assignment-router";
import { errorHandler } from "./shared/errors";
import { classRouter } from "./domain/classes/class-router";
import { studentRouter } from "./domain/students/student-router";
import { app } from "./app";
import { routes } from "./routes";

const assignments = assignmentPersistence(prisma);
const classes = classPersistence(prisma);
const students = studentPersistence(prisma);

const persistence = database(assignments, students, classes);

const classesService = classService(persistence);
const studentsService = studentService(persistence);
const assignmentsService = assigmentService(persistence);

const classesController = classController(classesService, classDTO());
const studentsController = studentController(studentsService, studentDTO());
const assignmentsController = assigmentController(
  assignmentsService,
  assigmentDTO()
);

const classRoutes = classRouter(classesController, errorHandler);
const studentRoutes = studentRouter(studentsController, errorHandler);
const assignmentRoutes = assignmentRouter(assignmentsController, errorHandler);

const appRoutes = routes(assignmentRoutes, studentRoutes, classRoutes);

const application = app(appRoutes);

export default application;
