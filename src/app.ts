import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorHandler from "./common/middleware/globlaErrorHandler.middleware";
import { userRouter } from "./modules/user/user.routes";
import notFoundHandler from "./common/middleware/notFound.middleware";
import ApiResponse from "./common/utils/api-response.utils";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  ApiResponse.ok(res, "Server is healthy");
});
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(notFoundHandler);
app.use(globalErrorHandler);
