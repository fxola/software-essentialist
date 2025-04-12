import { PrismaClient } from "@prisma/client";
import { AssignmentPersistence } from "../../persistence/types";

class Assignments {
  public persistence: AssignmentPersistence;

  constructor(private prisma: PrismaClient) {
    this.persistence = this.createAssignmentPersistence();
  }

  private createAssignmentPersistence = (): AssignmentPersistence => {
    return {
      save: this.saveAssignment,
      getById: this.getAssignment,
      addStudent: this.saveStudentAssignment,
      submit: this.submitAssignment,
      grade: this.gradeAssignment,
    };
  };

  private saveAssignment = async (classId: string, title: string) => {
    return await this.prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });
  };

  private getAssignment = async (id: string) => {
    return await this.prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });
  };

  private saveStudentAssignment = async (
    studentId: string,
    assignmentId: string
  ) => {
    return await this.prisma.studentAssignment.create({
      data: {
        studentId,
        assignmentId,
      },
    });
  };

  private submitAssignment = async (id: string) => {
    return await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });
  };

  private gradeAssignment = async (id: string, grade: string) => {
    return await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        grade,
      },
    });
  };
}

export default Assignments;
