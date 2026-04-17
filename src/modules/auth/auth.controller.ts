import { type Response, type Request, type NextFunction } from "express";
import * as authService from "./auth.services.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import path from "path";

const register = async function (req: Request, res: Response) {
  const userData = await authService.register(req.body);
  ApiResponse.ok(
    res,
    "Registration successful. Please verify your email.",
    userData,
  );
};

const login = async function (req: Request, res: Response) {
  const { userObj, refreshToken, accessToken } = await authService.login(
    req.body,
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  ApiResponse.ok(res, "Login successful.", userObj);
};

const verifyEmail = async function (req: Request, res: Response) {
  if (!req.body.token)
    throw ApiError.badRequest("Verification token is required");
  await authService.verifyEmail(req.body.token);
  ApiResponse.ok(res, "Email verified successfully");
};

export const sendVerifyEmailHtml = async function (
  req: Request,
  res: Response,
) {
  res.sendFile(
    path.join(
      process.cwd(),
      "src/modules/auth/templates/pages/verify-mail.html",
    ),
  );
};

const refreshAccessToken = async function (req: Request, res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(refreshToken);
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ApiResponse.ok(res, "Access Token Refreshed", { accessToken });
};

const logout = async function (req: Request, res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  await authService.logout(req.user!.id);
  ApiResponse.ok(res, "User logged out successfully");
};

const getMe = async function (req: Request, res: Response) {
  const userData = await authService.getMe(req.user!.id);
  ApiResponse.ok(res, "User data found successfully", userData);
};

const forgotPassword = async function (req: Request, res: Response) {
  await authService.forgotPassword(req.body);
  ApiResponse.ok(
    res,
    "If a user with that email exists, a password reset link has been sent.",
  );
};

const resetPassword = async function (req: Request, res: Response) {
  await authService.resetPassword(req.body);
  ApiResponse.ok(res, "Password reseted successfully");
};

const changeAvatar = async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const file = req.file;
  const avatarUrl = await authService.changeAvatar(req);
  if (!avatarUrl) return next(new Error("Something went wrong"));
  ApiResponse.ok(res, "Avatar updated successfully", { avatarUrl });
};

export {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  changeAvatar,
};
