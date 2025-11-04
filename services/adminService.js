import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../middlewares/errorHandler.js";
import { isValidEmail } from "../utils/emailValidator.js";

const prisma = new PrismaClient();

export const createClassService = async (classData) => {
  const { name } = classData;
  if (!name) throw new AppError("Class name is required", 400);

  const existingClass = await prisma.class.findUnique({
    where: { name: name.trim().toLowerCase() },
  });
  if (existingClass) throw new AppError("Class with this name already exists", 409);

  return await prisma.class.create({
    data: { name: name.trim().toLowerCase() },
  });
};

export const createSubjectService = async (subjectData) => {
  const { name, classId } = subjectData;
  if (!name || !classId)
    throw new AppError("Subject name and classId are required", 400);

  const classExists = await prisma.class.findUnique({
    where: { id: Number(classId) },
  });
  if (!classExists) throw new AppError("Invalid class ID", 404);

  return await prisma.subject.create({
    data: {
      name: name.trim().toLowerCase(),
      classId: Number(classId),
    },
  });
};

export const addTeacherService = async (teacherData) => {
  const { name, email, password } = teacherData;

  if (!name || !email || !password)
    throw new AppError("Name, email, and password are required", 400);

  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmail(normalizedEmail))
    throw new AppError("Invalid email format", 400);

  const teacherExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (teacherExists) throw new AppError("Teacher with this email already exists", 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newTeacher = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "TEACHER",
      teacher: { create: {} },
    },
    include: { teacher: true },
  });

  const { password: _, ...teacherWithoutPassword } = newTeacher;
  return teacherWithoutPassword;
};

export const addStudentService = async (studentData) => {
  const { name, email, password, classId } = studentData;

  if (!name || !email || !password || !classId)
    throw new AppError("All student fields are required", 400);

  const normalizedEmail = email.trim().toLowerCase();
  if (!isValidEmail(normalizedEmail))
    throw new AppError("Invalid email format", 400);

  const studentExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (studentExists)
    throw new AppError("Student with this email already exists", 409);

  const classExists = await prisma.class.findUnique({
    where: { id: Number(classId) },
  });
  if (!classExists) throw new AppError("Invalid class ID", 404);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newStudent = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "STUDENT",
      student: {
        create: { classId: Number(classId) },
      },
    },
    include: { student: true },
  });

  const { password: _, ...studentWithoutPassword } = newStudent;
  return studentWithoutPassword;
};

export const updateTeacherService = async (teacherId, updateData) => {
  const { name, email, password } = updateData;

  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(teacherId) },
    include: { user: true },
  });
  if (!teacher) throw new AppError("Teacher not found", 404);

  const updateFields = {};
  if (name) updateFields.name = name.trim();
  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail))
      throw new AppError("Invalid email format", 400);
    updateFields.email = normalizedEmail;
  }
  if (password) {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: teacher.userId },
    data: updateFields,
  });

  const { password: _, ...teacherWithoutPassword } = updatedUser;
  return teacherWithoutPassword;
};

export const updateStudentService = async (studentId, updateData) => {
  const { name, email, password, classId } = updateData;

  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
    include: { user: true },
  });
  if (!student) throw new AppError("Student not found", 404);

  const updateFields = {};
  if (name) updateFields.name = name.trim();
  if (email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail))
      throw new AppError("Invalid email format", 400);
    updateFields.email = normalizedEmail;
  }
  if (password) {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: student.userId },
    data: updateFields,
  });

  if (classId) {
    await prisma.student.update({
      where: { id: Number(studentId) },
      data: { classId: Number(classId) },
    });
  }

  const { password: _, ...studentWithoutPassword } = updatedUser;
  return studentWithoutPassword;
};

export const deleteTeacherService = async (teacherId) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(teacherId) },
  });
  if (!teacher) throw new AppError("Teacher not found", 404);

  await prisma.user.delete({
    where: { id: teacher.userId },
  });

  return { message: "Teacher deleted successfully" };
};

export const deleteStudentService = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { id: Number(studentId) },
  });
  if (!student) throw new AppError("Student not found", 404);

  await prisma.user.delete({
    where: { id: student.userId },
  });

  return { message: "Student deleted successfully" };
};

export const assignSubjectService = async (assignmentData) => {
  const { teacherId, subjectId } = assignmentData;

  if (!teacherId || !subjectId) {
    throw new AppError("Both teacherId and subjectId are required", 400);
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(teacherId) },
  });
  if (!teacher) throw new AppError("Teacher not found", 404);

  const subject = await prisma.subject.findUnique({
    where: { id: Number(subjectId) },
  });
  if (!subject) throw new AppError("Subject not found", 404);

  const existingAssignment = await prisma.teacherSubject.findFirst({
    where: {
      teacherId: Number(teacherId),
      subjectId: Number(subjectId),
    },
  });

  if (existingAssignment) {
    throw new AppError("Teacher is already assigned to this subject", 409);
  }

  const newAssignment = await prisma.teacherSubject.create({
    data: {
      teacherId: Number(teacherId),
      subjectId: Number(subjectId),
    },
    include: {
      teacher: { include: { user: { select: { name: true, email: true } } } },
      subject: { select: { name: true } },
    },
  });

  return {
    message: "Teacher assigned to subject successfully",
    assignment: newAssignment,
  };
};


export const getAssignedSubjectsService = async (teacherId) => {
  if (!teacherId) throw new AppError("Teacher ID is required", 400);

  const teacher = await prisma.teacher.findUnique({
    where: { id: Number(teacherId) },
    include: {
      user: { select: { name: true, email: true } },
      subjects: {
        include: {
          subject: {
            include: {
              class: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  if (!teacher) throw new AppError("Teacher not found", 404);

  const assignedSubjects = teacher.subjects.map((item) => ({
    subjectId: item.subject.id,
    subjectName: item.subject.name,
    className: item.subject.class.name,
  }));

  return {
    teacher: {
      id: teacher.id,
      name: teacher.user.name,
      email: teacher.user.email,
    },
    assignedSubjects,
  };
};

export const unassignSubjectService = async (teacherId, subjectId) => {
  if (!teacherId || !subjectId) {
    throw new AppError("Teacher ID and Subject ID are required", 400);
  }

  const assignment = await prisma.teacherSubject.findFirst({
    where: {
      teacherId: Number(teacherId),
      subjectId: Number(subjectId),
    },
  });

  if (!assignment) {
    throw new AppError("This subject is not assigned to the teacher", 404);
  }

  await prisma.teacherSubject.delete({
    where: { id: assignment.id },
  });

  return { message: "Subject unassigned successfully" };
};

