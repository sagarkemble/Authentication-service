import z from "zod";
import BaseDto from "../../../common/dto/base.dto.js";

class forgotPasswordDto extends BaseDto {
  static schema = z.object({
    email: z.string().email(),
  });
}

export default forgotPasswordDto;
