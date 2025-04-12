import { Request, Response, NextFunction } from "express";
import ClassService from "./class-service";
import { CreateClassDTO, CreateClassEnrollmentDTO } from "./class-dto";
import { parseForResponse } from "../../shared/utils";

export class ClassController {
  constructor(public classService: ClassService) {}

  async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateClassDTO.build(req.body);
      const response = this.classService.createClass(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async createClassEnrollment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateClassEnrollmentDTO.build(req.body);
      const response = this.classService.createClassEnrollment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
