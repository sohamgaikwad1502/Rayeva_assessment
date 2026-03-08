const logger = require('../logger');
const { AppError } = require('./AppError');

const errorHandler = (err, req, res, _next) => {

  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  logger.error(`${err.name}: ${err.message}`, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
    details: err.details || null,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: isOperational ? err.message : 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err.details,
      }),
    },
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
