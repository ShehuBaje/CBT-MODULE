import { protect } from "../middlewares/auth.js";
import { restrictTo } from "../middlewares/roles.js";
import express from "express";
import {
  createClass,
  createSubject,
  addTeacher,
  addStudent,
  updateTeacher,
  updateStudent,
  deleteTeacher,
  deleteStudent, 
  assignSubject, 
  getAssignedSubjects, 
  unassignSubject
} from "../controllers/adminController.js";

const router = express.Router();


router.use(protect);
router.use(restrictTo("ADMIN"));

// Class & Subject
router.post("/classes", createClass);
router.post("/subjects", createSubject);

// Teacher management
router.post("/teachers", addTeacher);
router.put("/teachers/:teacherId", updateTeacher);
router.delete("/teachers/:teacherId", deleteTeacher);
router.post("/assign-subject", assignSubject);
router.get("/teachers/:teacherId/subjects", getAssignedSubjects);
router.delete("/teachers/:teacherId/subjects/:subjectId", unassignSubject);



// Student management
router.post("/students", addStudent);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);

export default router;

