import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class resendVerificationEmailDto extends BaseDto {
  static override schema = z.object({
    email: z.email().trim().toLowerCase(),
    token: z.string(),
  });
}

export default resendVerificationEmailDto;
