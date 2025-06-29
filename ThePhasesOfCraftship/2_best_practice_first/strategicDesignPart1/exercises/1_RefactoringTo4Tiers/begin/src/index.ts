import express, { Request, Response } from "express";
import { prisma } from "./persistence/prisma";
import { Student, Class, Assignment, StudentAssignment } from "@prisma/client";
import { error } from "console";
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const Errors = {
  ValidationError: "ValidationError",
  StudentNotFound: "StudentNotFound",
  ClassNotFound: "ClassNotFound",
  AssignmentNotFound: "AssignmentNotFound",
  ServerError: "ServerError",
  ClientError: "ClientError",
  StudentAlreadyEnrolled: "StudentAlreadyEnrolled",
};

function isMissingKeys(data: any, keysToCheckFor: string[]) {
  for (let key of keysToCheckFor) {
    if (data[key] === undefined) return true;
  }
  return false;
}

function parseForResponse(data: unknown) {
  return JSON.parse(JSON.stringify(data));
}

function isUUID(id: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    id
  );
}

// GET all student submitted assignments
app.get("/student/:id/assignments", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(404).json({
        error: Errors.StudentNotFound,
        data: undefined,
        success: false,
      });
    }

    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });

    res.status(200).json({
      error: undefined,
      data: parseForResponse(studentAssignments),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
});

// GET all student grades
app.get("/student/:id/grades", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) {
      return res.status(400).json({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    }

    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(404).json({
        error: Errors.StudentNotFound,
        data: undefined,
        success: false,
      });
    }

    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });

    res.status(200).json({
      error: undefined,
      data: parseForResponse(studentAssignments),
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: Errors.ServerError, data: undefined, success: false });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
