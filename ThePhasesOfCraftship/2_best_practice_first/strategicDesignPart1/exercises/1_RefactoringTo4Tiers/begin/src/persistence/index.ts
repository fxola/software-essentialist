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
    this.students = new Students(db).persistence;
    this.classrooms = new Classrooms(db).persistence;
    this.assignments = new Assignments(db).persistence;
  }
}

export default Database;
