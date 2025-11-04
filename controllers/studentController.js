import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import {
  getAvailableExamService,
  takeExamService,
  viewResultService,
  getProfileService,
} from "../services/studentService.js";

export const getAvailableExams = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const exams = await getAvailableExamService(studentId);
  sendSuccessResponse(res, "Available exams retrieved successfully", exams);
});

export const takeExam = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const result = await takeExamService(studentId, req.body);
  sendSuccessResponse(res, "Exam submitted successfully", result, 201);
});

export const viewResults = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const results = await viewResultService(studentId);
  sendSuccessResponse(res, "Results retrieved successfully", results);
});

export const getProfile = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const profile = await getProfileService(studentId);
  sendSuccessResponse(res, "Profile retrieved successfully", profile);
});
