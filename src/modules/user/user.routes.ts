import router from "express";
import { authenticate } from "../auth/auth.middleware";
import * as userController from "./user.controller";

export const userRouter = router();

userRouter.get("/me", authenticate, userController.getMe);
