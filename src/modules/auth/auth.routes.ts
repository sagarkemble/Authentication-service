import { Router } from "express";
import validateDto from "../../common/middleware/validate-dto.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import * as authController from "./auth.controller.js";
import verifyEmailDto from "./dto/verifyEmail.dto.js";

const authRouter: Router = Router();

authRouter.post("/register", validateDto(RegisterDto), authController.register);
authRouter.post(
  "/verify-mail",
  validateDto(verifyEmailDto),
  authController.verifyEmail,
);

export default authRouter;
