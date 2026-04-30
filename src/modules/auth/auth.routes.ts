import router from "express";
import validateDto from "../../common/middleware/validateDto.middleware";
import registerDto from "./dto/register.dto";
import * as authController from "./auth.controller";

export const authRouter = router();
authRouter.post(
  "/register",
  validateDto(registerDto),
  authController.registerUser,
);
authRouter.post("/verify-email", authController.verifyEmail);
authRouter.get("/verify-email", authController.getVerifyEmail);
