import express from "express";
import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/roles.js";
import {
    submitExam,
    getMyResults,
    getAllResults
} from "../controllers/resultController.js";

const router = express.Router();

//Protect all routes
router.use(protect);

// Student submits exam or checks results
router.post("/submit", restrictTo("STUDENT"), submitExam);
router.get("/mine", restrictTo("STUDENT"), getMyResults);

// Admin views all results
router.get("/", restrictTo("ADMIN"), getAllResults);

export default router;