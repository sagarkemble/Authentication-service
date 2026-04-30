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
export { registerUser, getVerifyEmail };
