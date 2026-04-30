import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";
import loginDto from "./dto/login.dto";

export const authRouter = router();
authRouter.post(
  "/register",
  validateDto(registerDto),
  authController.registerUser,
);
authRouter.post("/login", validateDto(loginDto), authController.login);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.get("/verify-email", authController.getVerifyEmail);
