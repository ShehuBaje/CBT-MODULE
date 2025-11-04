export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  if (err.code === 'P2002') {
    err = new AppError('Duplicate value for a unique field.', 400);
  }

  if (err.code === 'P2025') {
    err = new AppError('Record not found.', 404);
  }

  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Invalid token. Please login again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    err = new AppError('Token expired. Please login again.', 401);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
