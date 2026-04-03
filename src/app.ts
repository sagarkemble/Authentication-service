import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import authRouter from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";

const app: Express = express();
app.use(express.json());
app.use("/auth", authRouter);

export default app;
