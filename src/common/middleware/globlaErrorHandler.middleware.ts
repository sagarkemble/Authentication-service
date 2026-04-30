import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.utils";

function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If it's custom error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        status: err.statusCode,
        details: err.details ?? [],
      },
    });
  }

  // Unknown or unexpected error
  console.error(err);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      status: 500,
      details: [],
    },
  });
}

export default globalErrorHandler;
