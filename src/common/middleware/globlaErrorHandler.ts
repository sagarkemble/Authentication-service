import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error";

function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // If it's custom error
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        status: err.statusCode,
        details: err.detail ?? [],
      },
    });
  }

  // Unknown or unexpected error
  console.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      status: 500,
      details: [],
    },
  });
}

export default globalErrorHandler;
