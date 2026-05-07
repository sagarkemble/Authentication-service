import z from "zod";
import type { Request } from "express";
import ApiError from "../utils/api-error.utils.js";

class BaseDto {
  static schema = z.object({});
  static validate(data: Request["body"]) {
    const parsedData = this.schema.safeParse(data);

    if (parsedData.error) {
      const formattedError = parsedData.error.issues.map((issue) => ({
        [issue.path[0] as string]: issue.message,
      }));

      throw ApiError.badRequest("Invalid data", formattedError);
    }
    return parsedData.data;
  }
}

export default BaseDto;
