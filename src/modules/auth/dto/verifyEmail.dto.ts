import z from "zod";
import BaseDto from "../../../common/dto/base-dto.js";

class verifyEmailDto extends BaseDto {
  static schema = z.object({
    verificationToken: z
      .string()
      .trim()
      .length(64, "Invalid Verification Token"),
  });
}

export default verifyEmailDto;
