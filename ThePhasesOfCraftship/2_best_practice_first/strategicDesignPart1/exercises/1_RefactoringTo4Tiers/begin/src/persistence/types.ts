export interface StudentPersistence {
  save: (name: string) => any;
  getAll: () => any;
  getById: (id: string) => any;
  getAllAssignments: (id: string) => any;
  getAllGrades: (id: string) => any;
  giveAssignment: (studentId: string, assignmentId: string) => any;
}

export interface ClassPersistence {
  save: (name: string) => any;
  getById: (id: string) => any;
  saveEnrollment: (studentId: string, classId: string) => any;
  getEnrollment: (studentId: string, classId: string) => any;
  getAllAssignments: (classId: string) => any;
}

export interface AssignmentPersistence {
  save: (classId: string, title: string) => any;
  submit: (assignmentId: string) => any;
  grade: (assignmentId: string, grade: string) => any;
  getById: (assignmentId: string) => any;
  getStudentAssignment: (id: string) => any;
}
