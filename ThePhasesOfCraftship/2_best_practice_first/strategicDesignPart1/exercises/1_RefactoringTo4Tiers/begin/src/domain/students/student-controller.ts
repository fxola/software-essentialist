import { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, GetStudentDTO } from "./student-dto";
import StudentService from "./student-service";
import { parseForResponse } from "../../shared/utils";

export class StudentController {
  constructor(private studentService: StudentService) {}

  async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = CreateStudentDTO.prepare(req.body);
      const student = await this.studentService.createStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllStudents(_: Request, res: Response, next: NextFunction) {
    try {
      const students = await this.studentService.getAllstudents();

      res.status(200).json({
        error: undefined,
        data: parseForResponse(students),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = GetStudentDTO.prepare(req.params);
      const student = await this.studentService.getStudent(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
