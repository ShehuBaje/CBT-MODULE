import express from "express";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/roles.js";
import {
  getAvailableExams,
  takeExam,
  viewResults,
  getProfile,
} from "../controllers/studentController.js";

const router = express.Router();


router.use(protect);
router.use(restrictTo("STUDENT"));

// Get available exams
router.get("/exams", getAvailableExams);

// Take exam
router.post("/exams/submit", takeExam);

// View all results
router.get("/results", viewResults);

// Get profile info
router.get("/profile", getProfile);

export default router;