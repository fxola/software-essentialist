import { Request, Response, NextFunction } from "express";
import { parseForResponse } from "../../shared/utils";
import { ClassDTO } from "./class-dto";
import { ClassService } from "./class-service";

function classController(classService: ClassService, classDTO: ClassDTO) {
  const createClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = classDTO.forCreate(req.body);
      const result = classService.save(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return { createClass };
}

export type ClassController = ReturnType<typeof classController>;
