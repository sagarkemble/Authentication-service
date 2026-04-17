import { Router } from "express";
import validateDto from "../../common/middleware/validate-dto.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import loginDto from "./dto/login.dto.js";
import forgotPasswordDto from "./dto/forgotPassword.dto.js";
import { authenticate, uploadAvatar } from "./auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/register", validateDto(RegisterDto), authController.register);
authRouter.post("/login", validateDto(loginDto), authController.login);
authRouter.post("/logout", authenticate, authController.logout);

authRouter.post("/verify-email", authController.verifyEmail);
authRouter.get("/verify-email", authController.sendVerifyEmailHtml);

authRouter.get("/change-password", authController.sendForgotPasswordHtml);
authRouter.post("/change-password", authController.changePassword);

authRouter.post("/refresh-access-token", authController.refreshAccessToken);

authRouter.get("/getme", authenticate, authController.getMe);

authRouter.post(
  "/forgot-password",
  validateDto(forgotPasswordDto),
  authController.forgotPassword,
);

authRouter.post(
  "/reset-password",
  validateDto(forgotPasswordDto),
  authController.resetPassword,
);

authRouter.patch(
  "/change-avatar",
  authenticate,
  uploadAvatar,
  authController.changeAvatar,
);

export default authRouter;
