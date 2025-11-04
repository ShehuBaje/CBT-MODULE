import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import {
  addQuestionService,
  getExamQuestionsService,
  updateQuestionService,
  deleteQuestionService,
} from "../services/questionService.js";

export const addQuestions = asyncHandler(async (req, res) => {
  const newQuestion = await addQuestionService(req.body);
  sendSuccessResponse(res, "Question added successfully", newQuestion, 201);
});

export const getExamQuestions = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const questions = await getExamQuestionsService(examId);
  sendSuccessResponse(
    res,
    "Questions retrieved successfully",
    { count: questions.length, questions },
    200
  );
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const updatedQuestion = await updateQuestionService(questionId, req.body);
  sendSuccessResponse(res, "Question updated successfully", updatedQuestion, 200);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const result = await deleteQuestionService(questionId);
  sendSuccessResponse(res, result.message, null, 200);
});
