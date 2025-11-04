import { AppError } from "../middlewares/errorHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("You must be logged in to perform this action.", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Only ${allowedRoles.join(", ")} can perform this action.`,
          403
        )
      );
    }

    next();
  };
};
