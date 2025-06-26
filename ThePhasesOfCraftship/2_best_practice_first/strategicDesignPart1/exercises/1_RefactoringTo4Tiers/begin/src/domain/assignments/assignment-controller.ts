import { Request, Response, NextFunction } from "express";
import { parseForResponse } from "../../shared/utils";
import { AssignmentDTO } from "./assignment-dto";
import { AssigmentsService } from "./assignment-service";

function assigmentController(
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

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return { createAssignment, submitAssignment };
}

export type AssigmentController = ReturnType<typeof assigmentController>;
