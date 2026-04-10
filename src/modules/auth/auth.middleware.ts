import type { Request, Response, NextFunction } from "express";
import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token;
  let decoded: { id: string; role: string } | null = null;

  if (req.headers?.authorization?.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];

  if (!token) throw ApiError.unauthorized("Not authenticated");

  try {
    decoded = verifyAccessToken(token) as { id: string; role: string };
  } catch (error) {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const user = await User.findById(decoded.id);

  if (!user) throw ApiError.unauthorized("User no longer exists");

  req.user = {
    id: String(user._id),
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
};
export { authenticate };
