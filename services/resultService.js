import { PrismaClient } from "@prisma/client";
import {AppError} from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const submitExamService = async (studentId, examId, answers) => {
  const exam = await prisma.exam.findUnique({
    where: { id: parseInt(examId) },
    include: { questions: true },
  });

  if (!exam) throw new AppError("Exam not found", 404);

  let totalScore = 0;
  let obtainedScore = 0;

  exam.questions.forEach((question) => {
    totalScore += question.marks;
    const studentAnswer = answers.find((ans) => ans.questionId === question.id);
    if (studentAnswer && studentAnswer.answer === question.correctAnswer) {
      obtainedScore += question.marks;
    }
  });

  const percentage = (obtainedScore / totalScore) * 100;

  const result = await prisma.result.create({
    data: {
      studentId,
      examId,
      score: obtainedScore,
      total: totalScore,
      percentage,
      status: percentage >= 50 ? "PASS" : "FAIL",
    },
  });

  return result;
};

export const getStudentResultsService = async (studentId) => {
  const results = await prisma.result.findMany({
    where: { studentId },
    include: {
      exam: { include: { subject: true } },
    },
  });

  if (!results.length) throw new AppError("No results found for this student", 404);
  return results;
};

export const getAllResultsService = async () => {
  const results = await prisma.result.findMany({
    include: {
      student: { include: { user: true } },
      exam: { include: { subject: true } },
    },
  });

  return results;
};
