import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";
import loginDto from "./dto/login.dto";
import verifyEmailDto from "./dto/verify-email.dto";
import { authenticate } from "./auth.middleware";

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
