import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const addQuestionService = async (questionData) => {
  const { examId, questionText, options, correctAnswer } = questionData;

  if (!examId || !questionText || !options || !correctAnswer) {
    throw new AppError("All fields are required", 400);
  }

  const exam = await prisma.exam.findUnique({
    where: { id: Number(examId) },
  });

  if (!exam) {
    throw new AppError("Exam not found", 404);
  }

  const newQuestion = await prisma.question.create({
    data: {
      examId: Number(examId),
      questionText,
      options,
      correctAnswer,
    },
  });

  return newQuestion;
};

export const getExamQuestionsService = async (examId) => {
  const questions = await prisma.question.findMany({
    where: { examId: Number(examId) },
  });

  if (!questions || questions.length === 0) {
    throw new AppError("No questions found for this exam", 404);
  }

  return questions;
};

export const updateQuestionService = async (questionId, updateData) => {
  const { questionText, options, correctAnswer } = updateData;

  const existingQuestion = await prisma.question.findUnique({
    where: { id: Number(questionId) },
  });

  if (!existingQuestion) {
    throw new AppError("Question not found", 404);
  }

  const updatedQuestion = await prisma.question.update({
    where: { id: Number(questionId) },
    data: {
      questionText: questionText ?? existingQuestion.questionText,
      options: options ?? existingQuestion.options,
      correctAnswer: correctAnswer ?? existingQuestion.correctAnswer,
    },
  });

  return updatedQuestion;
};

export const deleteQuestionService = async (questionId) => {
  const question = await prisma.question.findUnique({
    where: { id: Number(questionId) },
  });

  if (!question) {
    throw new AppError("Question not found", 404);
  }

  await prisma.question.delete({
    where: { id: Number(questionId) },
  });

  return { message: "Question deleted successfully" };
};
