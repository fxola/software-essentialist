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
      const result = await classService.create(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const createEnrollment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = classDTO.forCreateEnrollment(req.body);
      const result = await classService.createEnrollment(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = classDTO.forGetAssignments(req.body);
      const result = await classService.getAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return { createClass, createEnrollment, getAssignments };
}

export type ClassController = ReturnType<typeof classController>;
