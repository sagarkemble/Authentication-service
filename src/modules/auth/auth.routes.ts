import { Router } from "express";
import validateDto from "../../common/middleware/validate-dto.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import loginDto from "./dto/login.dto.js";
import forgotPasswordDto from "./dto/forgotPassword.dto.js";
import resetPasswordDto from "./dto/resetPassword.dto.js";
import { authenticate } from "./auth.middleware.js";

const authRouter: Router = Router();

authRouter.post("/register", validateDto(RegisterDto), authController.register);

authRouter.get("/verify-mail", authController.verifyEmail);
authRouter.post("/login", validateDto(loginDto), authController.login);

authRouter.post("/refresh-access-token", authController.refreshAccessToken);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.get("/getme", authenticate, authController.getMe);

authRouter.post(
  "/forgot-password",
  validateDto(forgotPasswordDto),
  authController.forgotPassword,
);
authRouter.post(
  "/reset-password",
  validateDto(resetPasswordDto),
  authController.resetPassword,
);

export default authRouter;
