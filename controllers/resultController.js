import { sendSuccessResponse } from "../utils/successResponse.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { 
  submitExamService, 
  getStudentResultsService, 
  getAllResultsService 
} from "../services/resultService.js";

export const submitExam = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { examId, answers } = req.body;

  const result = await submitExamService(studentId, examId, answers);
  sendSuccessResponse(res, "Exam submitted successfully", result);
});

export const getMyResults = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const results = await getStudentResultsService(studentId);
  sendSuccessResponse(res, "Your results retrieved successfully", results);
});

export const getAllResults = asyncHandler(async (req, res) => {
  const results = await getAllResultsService();
  sendSuccessResponse(res, "All results retrieved successfully", results);
});
