import { AssignmentPersistence } from "../domain/assignments/assignment-persistence";
import { ClassPersistence } from "../domain/classes/class-persistence";
import { StudentPersistence } from "../domain/students/student-persistence";

export function database(
  assignmentPersistence: AssignmentPersistence,
  studentPersistence: StudentPersistence,
  classPersistence: ClassPersistence
) {
  const assignments = assignmentPersistence;
  const students = studentPersistence;
  const classes = classPersistence;

  return {
    assignments,
    students,
    classes,
  };
}

export type Database = ReturnType<typeof database>;
