import { Request, Response, NextFunction } from "express";
import { createStudentDTO } from "./student-dto";
import { StudentService } from "./student-service";
import { parseForResponse } from "../../shared/utils";

function studentController(studentService: StudentService) {
  const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = createStudentDTO(req.body);
      const student = await studentService.save(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    createStudent,
  };
}

export type StudentController = ReturnType<typeof studentController>;
