import z from "zod";
import ApiError from "../utils/api-error.js";
import type { Request, Response, NextFunction } from "express";

class BaseDto {
  static schema = z.object({});
  static validate(data: Request["body"]) {
    const parsedData = this.schema.safeParse(data);

    if (parsedData.error) {
      const formatedError = parsedData.error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));

      throw ApiError.badRequest("Invalid data: ", formatedError);
    }
    return parsedData.data;
  }
}

export default BaseDto;
