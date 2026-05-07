import type { Request, Response } from "express";
import * as UserService from "./user.service";
import ApiResponse from "../../common/utils/api-response.utils";
const getMe = async function (req: Request, res: Response) {
  const userData = await UserService.getMe(req.user!.id);
  ApiResponse.ok(res, "User data retrieved successfully", userData);
};

export { getMe };
