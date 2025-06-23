import { AssignmentPersistence } from "../domain/assignments/assignment-persistence";
import { StudentPersistence } from "../domain/students/student-persistence";

function database(
  assignmentPersistence: AssignmentPersistence,
  studentPersistence: StudentPersistence
) {
  const assignments = assignmentPersistence;
  const students = studentPersistence;
  return {
    assignments,
    students,
  };
}

export type Database = ReturnType<typeof database>;
