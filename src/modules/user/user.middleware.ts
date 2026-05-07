import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import ApiError from "../../common/utils/api-error.utils";

const avatarMulterInstance = multer({
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg"];
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else
      cb(ApiError.badRequest("Invalid file type , only PNG or JPEG allowed"));
  },
});
export const uploadAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
