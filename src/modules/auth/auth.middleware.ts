import type { Response, Request, NextFunction } from "express";
import ApiError from "../../common/utils/api-error.utils";
import { verifyJwtToken } from "../../common/utils/jwt.utils";
import usersTable from "./auth.model";
import db from "../../common/config/db.config";
import { eq } from "drizzle-orm";

const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    throw ApiError.badRequest("Invalid authorization header format");

  const token = header.split(" ")[1];
  if (!token) throw ApiError.badRequest("Token is required");
  const decoded = verifyJwtToken(token) as { userId: string; email: string };
  const { userId, email } = decoded;
  req.user = {
    id: userId,
    email,
  };
  next();
};

export { authenticate };
