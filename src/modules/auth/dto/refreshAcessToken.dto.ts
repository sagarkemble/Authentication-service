import z from "zod";
import BaseDto from "../../../common/dto/base-dto.js";

class refreshAccessTokenDto extends BaseDto {
  static schema = z.object({
    refreshToken: z.string().trim().length(64, "Invalid Refresh Token"),
  });
}
