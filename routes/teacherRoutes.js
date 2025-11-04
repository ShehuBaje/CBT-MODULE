import express from "express";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/roles.js";
import {
  getAssignedSubjects,
  createExam,
  getTeacherExams
} from "../controllers/teacherController.js";
import {
  addQuestions,
  getExamQuestions,
  updateQuestion,
  deleteQuestion
} from "../controllers/questionController.js";

const router = express.Router();

router.use(protect);

//get assigned subjects
router.get("/subjects", restrictTo("TEACHER"), getAssignedSubjects);

//create and view exams
router.post("/exams", restrictTo("TEACHER"), createExam);
router.get("/exams", restrictTo("TEACHER", "ADMIN"), getTeacherExams);

// Question routes
router.post("/questions", restrictTo("TEACHER"), addQuestions);
router.get("/questions/:examId", restrictTo("TEACHER"), getExamQuestions);
router.put("/questions/:questionId", restrictTo("TEACHER"), updateQuestion);
router.delete("/questions/:questionId", restrictTo("TEACHER", "ADMIN"),deleteQuestion);

export default router;
