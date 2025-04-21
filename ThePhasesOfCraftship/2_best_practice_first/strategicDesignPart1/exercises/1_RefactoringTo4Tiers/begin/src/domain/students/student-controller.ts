import express, { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, GetStudentDTO } from "./student-dto";
import StudentService from "./student-service";
import { parseForResponse } from "../../shared/utils";
import { ErrorExceptionHandler } from "../../shared/errors";

export class StudentController {
  private router: express.Router;

  constructor(
    private studentService: StudentService,
    private errorHandler: ErrorExceptionHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  public getRouter() {
    return this.router;
  }

  private setupRoutes() {
    this.router.post("/", this.createStudent);
    this.router.get("/", this.getAllStudents);
    this.router.get("/:id", this.getStudent);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateStudentDTO.prepare(req.body);
      const student = await this.studentService.createStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllStudents = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const students = await this.studentService.getAllstudents();

      res.status(200).json({
        error: undefined,
        data: parseForResponse(students),
        success: true,
      });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  };

  getStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GetStudentDTO.prepare(req.params);
      const student = await this.studentService.getStudent(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
