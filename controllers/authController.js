import { loginUserService, registerUserService } from "../services/authService.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import { sendSuccessResponse } from "../utils/successResponse.js";
import { AppError } from "../middlewares/errorHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new AppError("Only admins can register new users", 403);
  }

  const newUser = await registerUserService(req.body);
  sendSuccessResponse(res, "User created successfully", newUser, 201);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { user, token } = await loginUserService(req.body);
  sendSuccessResponse(res, "User logged in successfully", { user, token }, 200);
});
