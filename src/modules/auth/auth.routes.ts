import { Router } from "express";
import validateDto from "../../common/middleware/validate-dto.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import verifyEmailDto from "./dto/verifyEmail.dto.js";
import loginDto from "./dto/login.dto.js";
import refreshAccessTokenDto from "./dto/refreshAcessToken.dto.js";
import logoutDto from "./dto/logout.dto.js";
import forgotPasswordDto from "./dto/forgotPassword.dot.js";

const authRouter: Router = Router();

authRouter.post("/register", validateDto(RegisterDto), authController.register);

authRouter.post(
  "/verify-mail",
  validateDto(verifyEmailDto),
  authController.verifyEmail,
);
authRouter.post("/login", validateDto(loginDto), authController.login);

authRouter.post(
  "/refresh-access-token",
  validateDto(refreshAccessTokenDto),
  authController.refreshAccessToken,
);

authRouter.post("/logout", validateDto(logoutDto), authController.logout);

authRouter.get("/getme", authController.getMe);

authRouter.post(
  "/forgot-password",
  validateDto(forgotPasswordDto),
  authController.forgotPassword,
);

export default authRouter;
