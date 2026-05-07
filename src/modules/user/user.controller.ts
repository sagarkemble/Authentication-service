import type { Request, Response } from "express";
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
export { getMe, patchMe, deleteMe };
