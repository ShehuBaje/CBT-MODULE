import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const getAvailableExamService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    include: { class: true },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const exams = await prisma.exam.findMany({
    where: {
      subject: { classId: student.classId },
    },
    include: {
      subject: { select: { name: true } },
      teacher: {
        include: { user: { select: { name: true } } },
      },
    },
  });

  return exams;
};

export const takeExamService = async (studentId, examData) => {
  const { examId, answers } = examData;

  const student = await prisma.student.findUnique({
    where: { userId: studentId },
  });
  if (!student) throw new AppError("Student not found", 404);

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { questions: true },
  });

  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  let score = 0;
  exam.questions.forEach((question) => {
    const studentAnswer = answers[question.id];
    if (studentAnswer && studentAnswer === question.correctAnswer) {
      score += 1;
    }
  });

  const result = await prisma.result.create({
    data: {
      student: { connect: { id: student.id } },
      exam: { connect: { id: examId } },
      score,
    },
  });

  return {
    score,
    totalQuestions: exam.questions.length,
    result,
  };
};

export const viewResultService = async (studentId) => {
  const results = await prisma.result.findMany({
    where: { student: { userId: studentId } },
    include: {
      exam: {
        include: {
          subject: { select: { name: true } },
        },
      },
    },
  });

  return results;
};

export const getProfileService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { userId: studentId },
    include: {
      user: { select: { name: true, email: true } },
      class: { select: { name: true } },
    },
  });

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};
