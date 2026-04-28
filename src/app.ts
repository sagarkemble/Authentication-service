import express, { urlencoded } from "express";
import { authRouter } from "./modules/auth/auth.routes";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/auth", authRouter);
