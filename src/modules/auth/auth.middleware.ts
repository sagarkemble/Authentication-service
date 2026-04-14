import type { Request, Response, NextFunction } from "express";
import ApiError from "../../common/utils/api-error.js";
import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";
import multer from "multer";

const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let token;
  let decoded: { id: string; role: string } | null = null;

  if (req.cookies?.accessToken) token = req.cookies.accessToken;

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

const avatarMulterInstance = multer({
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else
      cb(ApiError.badRequest("Invalid file type , only PNG or JPEG allowed"));
  },
});
const uploadAvatar = (req: Request, res: Response, next: NextFunction) => {
  avatarMulterInstance.single("avatar")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(ApiError.badRequest("File too large (max 2MB)"));
      }
      return next(ApiError.badRequest(err.message));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

export { authenticate, uploadAvatar };
