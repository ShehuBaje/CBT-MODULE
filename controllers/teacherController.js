import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import { 
    getAssignedSubjectService, 
    createExamService, 
    getTeacherExamService } from "../services/teacherService.js";

export const getAssignedSubjects = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const subjects = await getAssignedSubjectService(userId);

  sendSuccessResponse(res, "Assigned subjects retrieved successfully", subjects, 200);
});

export const createExam = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const exam = await createExamService(userId, req.body);

  sendSuccessResponse(res, "Exam created successfully", exam, 201);
});

export const getTeacherExams = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const exams = await getTeacherExamService(userId);
  sendSuccessResponse(res, "Teacher exams fetched successfully", exams, 200);
});
