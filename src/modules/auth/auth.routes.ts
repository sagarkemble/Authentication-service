import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";
import loginDto from "./dto/login.dto";
import verifyEmailDto from "./dto/verify-email.dto";
import { authenticate } from "./auth.middleware";
import forgetPasswordDto from "./dto/forgot-password.dto";
import forgotPasswordDto from "./dto/forgot-password.dto";
import resetPasswordDto from "./dto/reset-password.dto";

export const authRouter = router();
authRouter.post(
  "/register",
  validateDto(registerDto),
  authController.registerUser,
);
authRouter.post("/login", validateDto(loginDto), authController.login);
authRouter.post(
  "/verify-email",
  validateDto(verifyEmailDto),
  authController.verifyEmail,
);
authRouter.get("/verify-email", authController.getVerifyEmail);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post(
  "/forgot-password",
  validateDto(forgotPasswordDto),
  authController.forgotPassword,
);

authRouter.get("/reset-password", authController.getResetPassword);
authRouter.post(
  "/reset-password",
  validateDto(resetPasswordDto),
  authController.resetPassword,
);
