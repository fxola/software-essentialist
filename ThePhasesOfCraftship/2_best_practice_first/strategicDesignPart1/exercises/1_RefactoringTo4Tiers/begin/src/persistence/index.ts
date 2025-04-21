import { PrismaClient } from "@prisma/client";
import {
  AssignmentPersistence,
  ClassPersistence,
  StudentPersistence,
} from "./types";

import Students from "../domain/students/student-persistence";
import Classrooms from "../domain/classes/class-persistence";
import Assignments from "../domain/assignments/assignment-persistence";

class Database {
  public students: StudentPersistence;
  public classrooms: ClassPersistence;
  public assignments: AssignmentPersistence;

  constructor(db: PrismaClient) {
    this.students = new Students(db).getPersistence();
    this.classrooms = new Classrooms(db).getPersistence();
    this.assignments = new Assignments(db).getPersistence();
  }
}

export default Database;
