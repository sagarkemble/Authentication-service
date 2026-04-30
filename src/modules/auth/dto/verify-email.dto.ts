import z from "zod";
import BaseDto from "../../../common/dto/base.dto";
import type loginDto from "./login.dto";

class verifyEmailDto extends BaseDto {
  static override schema = z.object({
    email: z.email().trim().toLowerCase(),
    token: z.string(),
  });
}

export default verifyEmailDto;
