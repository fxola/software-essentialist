import { Request, Response, NextFunction } from "express";
import { parseForResponse } from "../../shared/utils";
import { createAssigmentDTO } from "./assignment-dto";
import { AssigmentsService } from "./assignment-service";

export function AssigmentController(assigmentsService: AssigmentsService) {
  const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = createAssigmentDTO(req.body);
      const result = assigmentsService.saveAssignment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return { createAssignment };
}
