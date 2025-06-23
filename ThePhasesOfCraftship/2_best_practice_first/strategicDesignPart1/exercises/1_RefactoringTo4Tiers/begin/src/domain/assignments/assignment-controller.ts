import { Request, Response, NextFunction } from "express";
import { parseForResponse } from "../../shared/utils";
import { createAssigmentDTO } from "./assignment-dto";
import { AssigmentsService } from "./assignment-service";

function assigmentController(assigmentsService: AssigmentsService) {
  const createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = createAssigmentDTO(req.body);
      const result = await assigmentsService.saveAssignment(dto);

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

export type AssigmentController = ReturnType<typeof assigmentController>;
