import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import {
  createClassService,
  createSubjectService,
  addTeacherService,
  addStudentService,
  updateTeacherService,
  updateStudentService,
  deleteTeacherService,
  deleteStudentService,
  assignSubjectService, 
  getAssignedSubjectsService, 
  unassignSubjectService
} from "../services/adminService.js";

export const createClass = asyncHandler(async (req, res) => {
  const newClass = await createClassService(req.body);
  sendSuccessResponse(res, "Class created successfully", newClass, 201);
});

export const createSubject = asyncHandler(async (req, res) => {
  const newSubject = await createSubjectService(req.body);
  sendSuccessResponse(res, "Subject created successfully", newSubject, 201);
});

export const addTeacher = asyncHandler(async (req, res) => {
  const newTeacher = await addTeacherService(req.body);
  sendSuccessResponse(res, "Teacher added successfully", newTeacher, 201);
});

export const addStudent = asyncHandler(async (req, res) => {
  const newStudent = await addStudentService(req.body);
  sendSuccessResponse(res, "Student added successfully", newStudent, 201);
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const updatedTeacher = await updateTeacherService(teacherId, req.body);
  sendSuccessResponse(res, "Teacher updated successfully", updatedTeacher, 200);
});

export const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const updatedStudent = await updateStudentService(studentId, req.body);
  sendSuccessResponse(res, "Student updated successfully", updatedStudent, 200);
});

export const deleteTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const result = await deleteTeacherService(teacherId);
  sendSuccessResponse(res, result.message, null, 200);
});

export const deleteStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const result = await deleteStudentService(studentId);
  sendSuccessResponse(res, result.message, null, 200);
});

export const assignSubject = asyncHandler(async (req, res) => {
  const newAssignment = await assignSubjectService(req.body);
  sendSuccessResponse(res, "Teacher assigned successfully", newAssignment, 201);
});

export const getAssignedSubjects = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;
  const data = await getAssignedSubjectsService(teacherId);
  sendSuccessResponse(res, "Assigned subjects fetched successfully", data, 200);
});

export const unassignSubject = asyncHandler(async (req, res) => {
  const { teacherId, subjectId } = req.params;
  const result = await unassignSubjectService(teacherId, subjectId);
  sendSuccessResponse(res, result.message, null, 200);
});


