import { PrismaClient } from "@prisma/client";

import Students from "../modules/students/student-persistence";
import Classrooms from "../modules/classes/class-persistence";
import Assignments from "../modules/assignments/assignment-persistence";

class Database {
  public students;
  public classrooms;
  public assignments;

  constructor(db: PrismaClient) {
    this.students = new Students(db).getPersistence();
    this.classrooms = new Classrooms(db).getPersistence();
    this.assignments = new Assignments(db).getPersistence();
  }
}

export default Database;
