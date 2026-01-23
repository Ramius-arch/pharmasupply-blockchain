// apiError.js
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || []; // Array of validation errors
  }
}

module.exports = ApiError;
