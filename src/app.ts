import express, { urlencoded, type NextFunction } from "express";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/auth", authRouter);
app.use(globalErrorHandler);
