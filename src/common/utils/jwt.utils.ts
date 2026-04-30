import jwt from "jsonwebtoken";

const generateJwtToken = function (payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ?? "15m") as any,
  });
};
export { generateJwtToken };
