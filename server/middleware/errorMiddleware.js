const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (err.code === 11000 || err.name === "MongoError") {
    statusCode = 400;
    message = "Duplicate key error";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.name === "SyntaxError") {
    statusCode = 400;
    message = "Invalid JSON format in request body";
  } else if (err.name === "RangeError") {
    statusCode = 400;
    message = "Out of range error";
  } // Add more specific error handling here if needed

  return res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
