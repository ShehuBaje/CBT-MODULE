import { sendSuccessResponse } from "../utils/successResponse.js";
import Joi from "joi";

export const registerUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string()
      .valid("admin", "teacher", "student")
      .required()
      .messages({
        "any.only": "Role must be one of: admin, teacher, or student",
      }),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return sendSuccessResponse(
      res,
      "Invalid request body",
      { details: error.details.map((d) => d.message) },
      400
    );
  }

  next();
};

export const loginUserValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return sendSuccessResponse(
      res,
      "Invalid request body",
      { details: error.details.map((d) => d.message) },
      400
    );
  }

  next();
};
