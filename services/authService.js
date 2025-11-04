import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/token.js";
import { isValidEmail } from "../utils/emailValidator.js";
import { AppError } from "../middlewares/errorHandler.js";

const prisma = new PrismaClient();

export const registerUserService = async (userData) => {
  const { name, email, password, role } = userData;

  if (!name || !email || !password || !role) {
    throw new AppError("All fields are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw new AppError("Invalid email format", 400);
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const formattedRole = role.trim().toUpperCase();

  const newUser = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: formattedRole,
    },
  });

  if (!newUser) {
    throw new AppError("User could not be created", 400);
  }

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUserService = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new AppError("Invalid password", 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};
