import express, { Request, Response, NextFunction } from "express";
import ClassService from "./class-service";
import { CreateClassDTO, CreateClassEnrollmentDTO } from "./class-dto";
import { parseForResponse } from "../../shared/utils";
import { ErrorExceptionHandler } from "../../shared/errors";

export class ClassController {
  private router: express.Router;

  constructor(
    private classService: ClassService,
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
    this.router.post("/", this.createClass);
    this.router.post("/enrollments", this.createClassEnrollment);
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler.handle);
  }

  createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = CreateClassDTO.prepare(req.body);
      const response = await this.classService.createClass(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  createClassEnrollment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = CreateClassEnrollmentDTO.prepare(req.body);
      const response = await this.classService.createClassEnrollment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
