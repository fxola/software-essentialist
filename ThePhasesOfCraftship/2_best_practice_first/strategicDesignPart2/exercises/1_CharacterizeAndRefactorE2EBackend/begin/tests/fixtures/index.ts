import { ClassroomBuilder } from "./classroom-builder";
import { StudentEnrollmentBuilder } from "./student-enrollment-builder";
import { StudentAssignmentBuilder } from "./student-assignment-builder";
import { StudentBuilder } from "./student-builder";
import { AssignmentBuilder } from "./assignment-builder";
import { SubmittedAssignmentBuilder } from "./submitted-assignment-builder";
import { GradeAssignmentBuilder } from "./grade-assignment-builder";

const aStudent = async () => {
  const student = await new StudentBuilder().build();
  return student;
};

const aClassroom = async () => {
  const classroom = await new ClassroomBuilder().build();
  return classroom;
};

const anEnrollment = async () => {
  const classroom = new ClassroomBuilder();

  const enrollment = new StudentEnrollmentBuilder()
    .from(classroom)
    .and(new StudentBuilder())
    .build();

  return enrollment;
};

const anAssignment = async () => {
  const assignment = await new AssignmentBuilder()
    .withClassRoom(new ClassroomBuilder())
    .build();

  return assignment;
};

const aStudentAssignment = async () => {
  const classroom = new ClassroomBuilder();

  const studentAssignment = await new StudentAssignmentBuilder()
    .from(
      new StudentEnrollmentBuilder().from(classroom).and(new StudentBuilder())
    )
    .and(new AssignmentBuilder().withClassRoom(classroom))
    .build();

  return studentAssignment;
};

const aSubmittedAssignment = async () => {
  const classroom = new ClassroomBuilder();

  const enrollment = new StudentEnrollmentBuilder()
    .from(classroom)
    .and(new StudentBuilder());

  const studentAssignmentBuilder = new StudentAssignmentBuilder()
    .from(enrollment)
    .and(new AssignmentBuilder().withClassRoom(classroom));

  const { studentAssignment, submittedAssignment } =
    await new SubmittedAssignmentBuilder()
      .from(studentAssignmentBuilder)
      .build();

  return { studentAssignment, submittedAssignment };
};

const aGradedAssignment = async ({ grade }: { grade: string }) => {
  const classroom = new ClassroomBuilder();

  const enrollment = new StudentEnrollmentBuilder()
    .from(classroom)
    .and(new StudentBuilder());

  const studentAssignmentbuilder = new StudentAssignmentBuilder()
    .from(enrollment)
    .and(new AssignmentBuilder().withClassRoom(classroom));

  const submittedAssignment = new SubmittedAssignmentBuilder().from(
    studentAssignmentbuilder
  );

  const { studentAssignment, gradedAssignment } =
    await new GradeAssignmentBuilder()
      .from(submittedAssignment)
      .withGrade(grade)
      .build();

  return { studentAssignment, gradedAssignment };
};

export {
  aStudent,
  aClassroom,
  anEnrollment,
  anAssignment,
  aGradedAssignment,
  aStudentAssignment,
  aSubmittedAssignment,
};
