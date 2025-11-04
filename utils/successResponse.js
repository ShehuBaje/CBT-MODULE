export const sendSuccessResponse = (res, message, data = {}, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });
};
