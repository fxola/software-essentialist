import { AssignmentPersistence } from "../domain/assignments/assignment-persistence";

function database(assignmentPersistence: AssignmentPersistence) {
  const assignments = assignmentPersistence;
  return {
    assignments,
  };
}

export type Database = ReturnType<typeof database>;
