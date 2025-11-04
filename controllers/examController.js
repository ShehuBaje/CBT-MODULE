import { asyncHandler } from "../middlewares/errorHandler.js";
import { 
  getAllExamsService, 
  getExamByIdService, 
  deleteExamService 
} from "../services/examService.js";
import { sendSuccessResponse } from "../utils/successResponse.js";

export const getAllExams = asyncHandler(async (req, res) => {
  const exams = await getAllExamsService();
  sendSuccessResponse(res, "All exams retrieved successfully", exams);
});

export const getExamById = asyncHandler(async (req, res) => {
  const examId = req.params.id;
  const exam = await getExamByIdService(examId);
  sendSuccessResponse(res, "Exam details fetched successfully", exam);
});

export const deleteExam = asyncHandler(async (req, res) => {
  const examId = req.params.id;
  const result = await deleteExamService(examId);
  sendSuccessResponse(res, "Exam deleted successfully", result);
});
