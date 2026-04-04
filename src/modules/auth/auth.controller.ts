import { type Response, type Request } from "express";
import * as authService from "./auth.services.js";
import ApiResponse from "../../common/utils/api-response.js";

const register = async function (req: Request, res: Response) {
  const userData = await authService.register(req.body);
  ApiResponse.ok(
    res,
    "Registration successful. Please verify your email.",
    userData,
  );
};

const login = async function (req: Request, res: Response) {
  const userData = await authService.login(req.body);
  ApiResponse.ok(res, "Login successful.", userData);
};

const verifyEmail = async function (req: Request, res: Response) {
  const userData = await authService.verifyEmail(req.body);
  ApiResponse.ok(res, "Mail successfully verified", userData);
};

const refreshAccessToken = async function (req: Request, res: Response) {
  const tokens = await authService.refreshAccessToken(req.body);
  ApiResponse.ok(res, "Access Token Refreshed", tokens);
};

export { register, verifyEmail, login, refreshAccessToken };
