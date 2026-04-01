class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(409, message);
  }

  static unprocessable(message = "Unprocessable Entity") {
    return new ApiError(422, message);
  }

  static tooManyRequests(message = "Too Many Requests") {
    return new ApiError(429, message);
  }
}

export default ApiError;
