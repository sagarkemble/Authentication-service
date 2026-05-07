import router from "express";
import { authenticate } from "../auth/auth.middleware";
import * as userController from "./user.controller";
import patchMeDto from "./dto/patch-me.dto";
import validateDto from "../../common/middleware/validateDto.middleware";
import deleteMeDto from "./dto/delete-me.dto";
import changeEmailDto from "./dto/change-email.dto";
import verifyEmailDto from "./dto/verify-email.dto";
import { uploadAvatar } from "./user.middleware";
import resendVerificationEmailDto from "./dto/resend-verify-email.dto";

export const userRouter = router();

userRouter.get("/me", authenticate, userController.getMe);
userRouter.patch(
  "/me",
  authenticate,
  validateDto(patchMeDto),
  userController.patchMe,
);
userRouter.delete(
  "/me",
  authenticate,
  validateDto(deleteMeDto),
  userController.deleteMe,
);
userRouter.post(
  "/change-email",
  authenticate,
  validateDto(changeEmailDto),
  userController.changeEmail,
);
userRouter.get("/verify-email", userController.getVerifyEmail);
userRouter.post(
  "/verify-email",
  validateDto(verifyEmailDto),
  userController.verifyEmail,
);
userRouter.post(
  "/avatar",
  authenticate,
  uploadAvatar,
  userController.uploadAvatar,
);
userRouter.post(
  "/resend-verify-email",
  validateDto(resendVerificationEmailDto),
  userController.resendVerificationEmail,
);
