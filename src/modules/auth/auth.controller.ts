import type { Request, Response } from "express";
import * as AuthService from "./auth.service";
import ApiResponse from "../../common/utils/api-response.utils";
import path from "path";
const registerUser = async function (req: Request, res: Response) {
  const { firstName, lastName, email, password } = req.body;
  const userData = await AuthService.registerUser(
    firstName,
    lastName,
    email,
    password,
  );
  ApiResponse.created(
    res,
    "User registered successfully. Please check your email to verify your account.",
    userData,
  );
};

const verifyEmail = async function (req: Request, res: Response) {
  const { token, email } = req.body;
  await AuthService.verifyEmail(token, email);
  ApiResponse.ok(res, "Email verified successfully.");
};

const getVerifyEmail = async function (req: Request, res: Response) {
  {
    const emailHtmlPath = path.resolve(
      "src",
      "modules",
      "auth",
      "templates",
      "pages",
      "verify-email.html",
    );
    ApiResponse.html(res, emailHtmlPath, "success");
  }
};

const login = async function (req: Request, res: Response) {
  const { email, password } = req.body;
  const userData = await AuthService.login(email, password);
  res.cookie("refreshToken", userData.refreshToken, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const { refreshToken, ...safeUserData } = userData;
  ApiResponse.ok(res, "Login successful", safeUserData);
};
export { registerUser, getVerifyEmail, verifyEmail, login };
