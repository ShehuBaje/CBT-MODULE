import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const getAssignedSubjectService = async (userId) => {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    include: {
      subjects: {
        include: {
          subject: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new AppError("Teacher not found or not linked to a user", 404);
  }

  const assignedSubjects = teacher.subjects.map((record) => record.subject);

  return assignedSubjects;
};

export const createExamService = async (userId, examData) => {
  const { title, subjectId, duration } = examData;

  if (!title || !subjectId || !duration) {
    throw new AppError("Title, subjectId, and duration are required", 400);
  }

  const teacher = await prisma.teacher.findUnique({
    where: { userId },
  });

  if (!teacher) {
    throw new AppError("Teacher record not found", 404);
  }

  const exam = await prisma.exam.create({
    data: {
      title: title.trim(),
      subjectId: Number(subjectId),
      teacherId: teacher.id,
      duration: Number(duration),
    },
  });

  if (!exam) {
    throw new AppError("Exam could not be created", 400);
  }

  return exam;
};

export const getTeacherExamService = async (userId) => {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
  });

  if (!teacher) {
    throw new AppError("Teacher not found", 404);
  }

  const exams = await prisma.exam.findMany({
    where: { teacherId: teacher.id },
    include: {
      subject: true,
    },
  });

  if (!exams || exams.length === 0) {
    return [];
  }

  return exams;

};