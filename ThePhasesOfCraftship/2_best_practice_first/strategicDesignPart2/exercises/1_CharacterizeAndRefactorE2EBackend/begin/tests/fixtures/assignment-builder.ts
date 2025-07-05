import { Assignment } from "@prisma/client";
import { prisma } from "../../src/database";
import { ClassroomBuilder } from "./classroom-builder";

export class AssignmentBuilder {
  private classroomBuilder?: ClassroomBuilder;
  private assignment: Partial<Assignment>;

  constructor() {
    this.assignment = {};
  }

  getTitle() {
    return this.assignment.title;
  }

  withTitle(title: string) {
    this.assignment.title = title;
    return this;
  }

  withClassRoom(classRoomBuilder: ClassroomBuilder) {
    this.classroomBuilder = classRoomBuilder;
    return this;
  }

  async build() {
    if (!this.classroomBuilder) {
      throw new Error("A class must first be created");
    }

    if (!this.assignment.title) {
      throw new Error("Title must be provided for this assignment");
    }

    const classroom = await this.classroomBuilder.build();

    const assignment = await prisma.assignment.create({
      data: {
        classId: classroom.id,
        title: this.assignment.title,
      },
    });

    return assignment;
  }
}
