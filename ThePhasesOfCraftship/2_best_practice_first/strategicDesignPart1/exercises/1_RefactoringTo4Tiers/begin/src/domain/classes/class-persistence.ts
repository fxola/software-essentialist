import { PrismaClient } from "@prisma/client";
import { ClassPersistence } from "../../persistence/types";

class Classrooms {
  private persistence: ClassPersistence;

  constructor(private prisma: PrismaClient) {
    this.persistence = this.createClassroomPersistence();
  }

  public getPersistence() {
    return this.persistence;
  }

  private createClassroomPersistence = (): ClassPersistence => {
    return {
      save: this.saveClass,
      getById: this.getClassroom,
      saveEnrollment: this.saveClassEnrollment,
      getEnrollment: this.getClassEnrollment,
      getAllAssignments: this.getAllAssignments,
    };
  };

  private saveClass = async (name: string) => {
    return await this.prisma.class.create({
      data: {
        name,
      },
    });
  };

  private saveClassEnrollment = async (studentId: string, classId: string) => {
    return await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });
  };

  private getAllAssignments = async (id: string) => {
    return await this.prisma.assignment.findMany({
      where: {
        classId: id,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });
  };

  private getClassroom = async (id: string) => {
    return await this.prisma.class.findUnique({
      where: {
        id,
      },
    });
  };

  private getClassEnrollment = async (studentId: string, classId: string) => {
    return await this.prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });
  };
}

export default Classrooms;
