import { Request, Response, NextFunction } from "express";
import AssignmentService from "./assignment-service";
import {
  SaveAssignmentDTO,
  SaveStudentAssignmentDTO,
  SubmitAssignmentDTO,
} from "./assignment-dto";
import { parseForResponse } from "../../shared/utils";

export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  async saveAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = SaveAssignmentDTO.prepare(req.body);
      const result = this.assignmentService.saveAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async saveStudentAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = SaveStudentAssignmentDTO.prepare(req.body);
      const response = await this.assignmentService.saveStudentAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitStudentAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dto = SubmitAssignmentDTO.prepare(req.body);
      const response = this.assignmentService.submitAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
