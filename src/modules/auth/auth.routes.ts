import { Router } from "express";
import validateDto from "../../common/middleware/validate-dto.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import verifyEmailDto from "./dto/verifyEmail.dto.js";
import loginDto from "./dto/login.dto.js";

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
  validateDto(loginDto),
  authController.login,
);

export default authRouter;
