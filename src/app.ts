import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import authRouter from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";

const app: Express = express();
app.use(express.json());

app.use("/auth", authRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.error,
    });
  }
  console.error(error);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;
