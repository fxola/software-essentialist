import { PrismaClient } from "@prisma/client";
import { StudentPersistence } from "../../persistence/types";

class Students {
  public persistence: StudentPersistence;

  public getPersistence() {
    return this.persistence;
  }

  constructor(private prisma: PrismaClient) {
    this.persistence = this.createStudentPersistence();
  }

  private createStudentPersistence = (): StudentPersistence => {
    return {
      save: this.saveStudent,
      getAll: this.getAllStudents,
      getById: this.getStudent,
      getAllAssignments: this.getAllAssignments,
      getAllGrades: this.getAllGrades,
    };
  };

  private saveStudent = async (name: string) => {
    return await this.prisma.student.create({
      data: {
        name,
      },
    });
  };

  private getAllStudents = async () => {
    return await this.prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  };

  private getStudent = async (id: string) => {
    return await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });
  };

  private getAllAssignments = async (id: string) => {
    return await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });
  };

  private getAllGrades = async (id: string) => {
    return await this.prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });
  };
}

export default Students;
