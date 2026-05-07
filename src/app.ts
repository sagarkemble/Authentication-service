import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import { userRouter } from "./modules/user/user.routes";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(globalErrorHandler);
