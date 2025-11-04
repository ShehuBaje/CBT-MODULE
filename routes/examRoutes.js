import express from "express";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/roles.js";
import {
    getAllExams,
    getExamById,
    deleteExam
} from "../controllers/examController.js";

const router = express.Router();

// All routes protected
router.use(protect);

// Admin can delete exams
router.delete("/:id", restrictTo ("ADMIN"), deleteExam);

// Student or Admin can view exams
router.get("/", restrictTo("ADMIN", "STUDENT"), getAllExams);
router.get("/:id", restrictTo("ADMIN", "STUDENT"), getExamById);

export default router;