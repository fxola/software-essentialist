import express, { Request, Response, NextFunction } from "express";
import AssignmentService from "./assignment-service";
import {
  GradeStudentAssignmentDTO,
  SaveAssignmentDTO,
  GiveStudentAssignmentDTO,
  SubmitAssignmentDTO,
  GetAssignmentDTO,
  GetAllAssignmentsDTO,
  GetStudentAssignmentsDTO,
} from "./assignment-dto";
import { parseForResponse } from "../../shared/utils";
import { ErrorExceptionHandler } from "../../shared/errors";

export class AssignmentController {
  private router: express.Router;

  public getRouter() {
    return this.router;
  }
  constructor(
    private assignmentService: AssignmentService,
    private errorHandler: ErrorExceptionHandler
  ) {
    this.router = express.Router();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  private setupRoutes() {
    this.router.post("/", this.saveAssignment);
    this.router.post("/student", this.giveStudentAssignment);
    this.router.post("/submit", this.submitStudentAssignment);
    this.router.post("/grade", this.gradeAssignment);
    this.router.get("/:id", this.getAssignment);
    this.router.get("/:id/classes", this.getAllAssignments);
    this.router.get("/:id/student", this.getStudentAssignments);
    this.router.get("/:id/grades", this.getStudentGradedAssignments);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  saveAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = SaveAssignmentDTO.prepare(req.body);
      const response = await this.assignmentService.saveAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  giveStudentAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = GiveStudentAssignmentDTO.prepare(req.body);
      const response = await this.assignmentService.giveStudentAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  submitStudentAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = SubmitAssignmentDTO.prepare(req.body);
      const response = await this.assignmentService.submitAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  gradeAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GradeStudentAssignmentDTO.prepare(req.body);
      const response = await this.assignmentService.gradeAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  getAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = GetAssignmentDTO.prepare(req.params);
      const response = await this.assignmentService.getAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = GetAllAssignmentsDTO.prepare(req.params);
      const response = await this.assignmentService.getAllAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  getStudentAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = GetStudentAssignmentsDTO.prepare(req.params);
      const response = await this.assignmentService.getStudentAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  getStudentGradedAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = GetStudentAssignmentsDTO.prepare(req.params);
      const response = await this.assignmentService.getStudentGradedAssignments(
        dto
      );

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
