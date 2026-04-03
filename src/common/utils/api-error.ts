class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  error: unknown;
  constructor(statusCode: number, message: string, error?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", error?: unknown) {
    return new ApiError(400, message, error);
  }

  static unauthorized(message = "Unauthorized", error?: unknown) {
    return new ApiError(401, message, error);
  }

  static forbidden(message = "Forbidden", error?: unknown) {
    return new ApiError(403, message, error);
  }

  static notFound(message = "Not Found", error?: unknown) {
    return new ApiError(404, message, error);
  }

  static conflict(message = "Conflict", error?: unknown) {
    return new ApiError(409, message, error);
  }

  static unprocessable(message = "Unprocessable Entity", error?: unknown) {
    return new ApiError(422, message, error);
  }

  static tooManyRequests(message = "Too Many Requests") {
    return new ApiError(429, message);
  }
}

export default ApiError;
