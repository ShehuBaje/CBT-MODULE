import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const getAllExamsService = async () => {
  const exams = await prisma.exam.findMany({
    include: {
      subject: true,
      teacher: { include: { user: true } },
    },
  });

  if (!exams || exams.length === 0) {
    throw new AppError("No exams found", 404);
  }

  return exams;
};

export const getExamByIdService = async (examId) => {
  const exam = await prisma.exam.findUnique({
    where: { id: Number(examId) },
    include: {
      questions: true,
      subject: true,
      teacher: { include: { user: true } },
    },
  });

  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  return exam;
};

export const deleteExamService = async (examId) => {
  const exam = await prisma.exam.findUnique({
    where: { id: Number(examId) },
  });

  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  await prisma.exam.delete({ where: { id: Number(examId) } });

  return { message: "Exam deleted successfully" };
};
