import z from "zod";
import ApiError from "../utils/api-error.js";
import type { Request, Response, NextFunction } from "express";

class BaseDto {
  static schema = z.object({});
  static validate(data: Request["body"]) {
    const parsedData = this.schema.safeParse(data);
    if (parsedData.error)
      throw ApiError.badRequest(
        "Invalid data: " + JSON.stringify(parsedData.error.format()),
      );
    return parsedData.data;
  }
}

export default BaseDto;
