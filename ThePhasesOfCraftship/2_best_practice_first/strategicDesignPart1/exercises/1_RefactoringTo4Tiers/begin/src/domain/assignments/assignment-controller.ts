import { Request, Response, NextFunction } from "express";
import { parseForResponse } from "../../shared/utils";
import { AssignmentDTO } from "./assignment-dto";
import { AssigmentsService } from "./assignment-service";

export function assigmentController(
  assigmentsService: AssigmentsService,
  assignmentDTO: AssignmentDTO
) {
  const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = assignmentDTO.forCreate(req.body);
      const result = await assigmentsService.create(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const submitAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = assignmentDTO.forSubmit(req.body);
      const result = await assigmentsService.submit(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const gradeAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = assignmentDTO.forGrade(req.body);
      const result = await assigmentsService.grade(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = assignmentDTO.forGetAssignment(req.body);
      const result = await assigmentsService.getOne(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return { createAssignment, submitAssignment, gradeAssignment, getAssignment };
}

export type AssigmentController = ReturnType<typeof assigmentController>;
