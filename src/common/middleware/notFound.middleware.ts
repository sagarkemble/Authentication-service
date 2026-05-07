import type { Request, Response } from "express";
import ApiError from "../utils/api-error.utils";

const notFoundHandler = function (req: Request, res: Response) {
  throw ApiError.notFound("Route not found");
};

export default notFoundHandler;
