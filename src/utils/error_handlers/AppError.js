class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, details);
  }
}

class AIServiceError extends AppError {
  constructor(message, details = null) {
    super(message, 502, details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class DatabaseError extends AppError {
  constructor(message, details = null) {
    super(message, 500, details);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AIServiceError,
  NotFoundError,
  DatabaseError,
};
