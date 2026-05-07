import type { Request, Response } from "express";
import path from "path";
import * as UserService from "./user.service";
import ApiResponse from "../../common/utils/api-response.utils";

const getMe = async function (req: Request, res: Response) {
  const userData = await UserService.getMe(req.user!.id);
  ApiResponse.ok(res, "User data retrieved successfully", userData);
};

const patchMe = async function (req: Request, res: Response) {
  const { firstName, lastName, avatarUrl } = req.body;
  const userData = await UserService.patchMe(
    { firstName, lastName, avatarUrl },
    req.user!.id,
  );
  ApiResponse.ok(res, "User data updated successfully", userData);
};

const deleteMe = async function (req: Request, res: Response) {
  await UserService.deleteMe(req.user!.id, req.body.password);
  ApiResponse.ok(res, "User account deleted successfully");
};

const changeEmail = async function (req: Request, res: Response) {
  const { newEmail, password } = req.body;
  await UserService.changeEmail(password, newEmail, req.user!.id);
  ApiResponse.ok(res, "Email change requested successfully");
};

const getVerifyEmail = async function (req: Request, res: Response) {
  const emailHtmlPath = path.resolve(
    "src",
    "modules",
    "user",
    "templates",
    "pages",
    "verify-email.html",
  );
  ApiResponse.html(res, emailHtmlPath, "success");
};

const verifyEmail = async function (req: Request, res: Response) {
  const { token, email } = req.body;
  await UserService.verifyEmail(token, email);
  ApiResponse.ok(res, "Email changed successfully.");
};

const uploadAvatar = async function (req: Request, res: Response) {
  const avatarUrl = await UserService.uploadAvatar(req.file!, req.user!.id);
  ApiResponse.ok(res, "Avatar uploaded successfully", { avatarUrl });
};

export {
  getMe,
  patchMe,
  deleteMe,
  changeEmail,
  getVerifyEmail,
  verifyEmail,
  uploadAvatar,
};
