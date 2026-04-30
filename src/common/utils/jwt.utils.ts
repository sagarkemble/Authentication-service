import jwt from "jsonwebtoken";
import ApiError from "./api-error.utils";

const generateJwtToken = function (payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as any,
  });
};

const verifyJwtToken = function (token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "jwt expired") {
      throw ApiError.unauthorized("Token expired");
    }
    throw ApiError.unauthorized("Invalid token");
  }
};
export { verifyJwtToken, generateJwtToken };
