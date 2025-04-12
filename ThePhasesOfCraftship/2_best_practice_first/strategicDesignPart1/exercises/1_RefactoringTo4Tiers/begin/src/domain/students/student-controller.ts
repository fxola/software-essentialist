import { NextFunction, Request, Response } from "express";
import { CreateStudentDTO } from "./student-dto";
import StudentService from "./student-service";
import { parseForResponse } from "../../shared/utils";

export class StudentController {
  constructor(private studentService: StudentService) {}
  async createStudentController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dto = CreateStudentDTO.build(req.body);
      const student = this.studentService.createStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
