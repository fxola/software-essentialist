import { PrismaClient } from "@prisma/client";

class Assignments {
  private persistence;

  constructor(private prisma: PrismaClient) {
    this.persistence = this.createAssignmentPersistence();
  }

  public getPersistence() {
    return this.persistence;
  }

  private createAssignmentPersistence = () => {
    return {
      save: this.saveAssignment,
      getById: this.getAssignment,
      getStudentAssignment: this.getStudentAssignment,
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

  private getStudentAssignment = async (id: string) => {
    return await this.prisma.studentAssignment.findUnique({
      where: {
        id,
      },
    });
  };
}

export default Assignments;
