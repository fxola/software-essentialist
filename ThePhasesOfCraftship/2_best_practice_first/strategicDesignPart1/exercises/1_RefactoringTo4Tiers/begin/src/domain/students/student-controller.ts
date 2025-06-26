import { Request, Response, NextFunction } from "express";
import { StudentDTO } from "./student-dto";
import { StudentService } from "./student-service";
import { parseForResponse } from "../../shared/utils";

function studentController(
  studentService: StudentService,
  studentDTO: StudentDTO
) {
  const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = studentDTO.forCreate(req.body);
      const student = await studentService.create(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const giveAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = studentDTO.forGiveAssignment(req.body);
      const result = await studentService.giveAssignment(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const getAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await studentService.getAll();

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  const getStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = studentDTO.forGetStudent(req.body);
      const result = await studentService.getOne(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(result),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getStudent,
    createStudent,
    giveAssignment,
    getAllStudents,
  };
}

export type StudentController = ReturnType<typeof studentController>;
