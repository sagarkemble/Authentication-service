class ApiError extends Error {
  code: string;
  statusCode: number;
  details: Array<unknown>;
  constructor(
    code: string,
    message: string,
    statusCode: number,
    detail: Array<unknown>,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = detail;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.BAD_REQUEST.code,
      message,
      ErrorDefinitions.BAD_REQUEST.status,
      details,
    );
  }

  static invalidRequest(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.INVALID_REQUEST.code,
      message,
      ErrorDefinitions.INVALID_REQUEST.status,
      details,
    );
  }

  static unauthorized(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.UNAUTHORIZED.code,
      message,
      ErrorDefinitions.UNAUTHORIZED.status,
      details,
    );
  }

  static forbidden(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.FORBIDDEN.code,
      message,
      ErrorDefinitions.FORBIDDEN.status,
      details,
    );
  }

  static notFound(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.NOT_FOUND.code,
      message,
      ErrorDefinitions.NOT_FOUND.status,
      details,
    );
  }

  static methodNotAllowed(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.METHOD_NOT_ALLOWED.code,
      message,
      ErrorDefinitions.METHOD_NOT_ALLOWED.status,
      details,
    );
  }

  static conflict(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.CONFLICT.code,
      message,
      ErrorDefinitions.CONFLICT.status,
      details,
    );
  }

  static unprocessable(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.UNPROCESSABLE_ENTITY.code,
      message,
      ErrorDefinitions.UNPROCESSABLE_ENTITY.status,
      details,
    );
  }

  static tooManyRequests(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.TOO_MANY_REQUESTS.code,
      message,
      ErrorDefinitions.TOO_MANY_REQUESTS.status,
      details,
    );
  }

  static internalServerError(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.INTERNAL_SERVER_ERROR.code,
      message,
      ErrorDefinitions.INTERNAL_SERVER_ERROR.status,
      details,
    );
  }

  static serviceUnavailable(message: string, details: Array<unknown> = []) {
    return new ApiError(
      ErrorDefinitions.SERVICE_UNAVAILABLE.code,
      message,
      ErrorDefinitions.SERVICE_UNAVAILABLE.status,
      details,
    );
  }
}

const ErrorDefinitions = {
  BAD_REQUEST: { code: "BAD_REQUEST", status: 400 },
  INVALID_REQUEST: { code: "INVALID_REQUEST", status: 400 },

  UNAUTHORIZED: { code: "UNAUTHORIZED", status: 401 },
  FORBIDDEN: { code: "FORBIDDEN", status: 403 },

  NOT_FOUND: { code: "NOT_FOUND", status: 404 },
  METHOD_NOT_ALLOWED: { code: "METHOD_NOT_ALLOWED", status: 405 },

  CONFLICT: { code: "CONFLICT", status: 409 },
  UNPROCESSABLE_ENTITY: { code: "UNPROCESSABLE_ENTITY", status: 422 },

  TOO_MANY_REQUESTS: { code: "TOO_MANY_REQUESTS", status: 429 },

  INTERNAL_SERVER_ERROR: { code: "INTERNAL_SERVER_ERROR", status: 500 },
  SERVICE_UNAVAILABLE: { code: "SERVICE_UNAVAILABLE", status: 503 },
} as const;

export default ApiError;
