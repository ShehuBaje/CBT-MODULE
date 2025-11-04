import { verifyToken } from "../utils/token.js";
import { AppError } from "../middlewares/errorHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in. Please log in to access this resource.", 401)
      );
    }

    const decoded = verifyToken(token);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    next(new AppError("Invalid or expired token. Please log in again.", 401));
  }
};