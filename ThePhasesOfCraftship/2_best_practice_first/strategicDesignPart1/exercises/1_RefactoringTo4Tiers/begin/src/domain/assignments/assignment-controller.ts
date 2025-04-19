import { Request, Response, NextFunction } from "express";
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

export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  async saveAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = SaveAssignmentDTO.prepare(req.body);
      const response = this.assignmentService.saveAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async giveStudentAssignment(req: Request, res: Response, next: NextFunction) {
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

  async gradeAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GradeStudentAssignmentDTO.prepare(req.body);
      const response = this.assignmentService.gradeAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetAssignmentDTO.prepare(req.params);
      const response = this.assignmentService.getAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetAllAssignmentsDTO.prepare(req.params);
      const response = this.assignmentService.getAllAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetStudentAssignmentsDTO.prepare(req.params);
      const response = this.assignmentService.getStudentAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(response),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentGradedAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dto = GetStudentAssignmentsDTO.prepare(req.params);
      const response = this.assignmentService.getStudentGradedAssignments(dto);

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
