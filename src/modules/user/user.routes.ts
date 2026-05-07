import router from "express";
import { authenticate } from "../auth/auth.middleware";
import * as userController from "./user.controller";
import patchMeDto from "./dto/patch-me.dto";
import validateDto from "../../common/middleware/validateDto.middleware";

export const userRouter = router();

userRouter.get("/me", authenticate, userController.getMe);
userRouter.patch(
  "/me",
  authenticate,
  validateDto(patchMeDto),
  userController.patchMe,
);
