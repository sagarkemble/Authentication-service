import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class forgetPasswordDto extends BaseDto {
  static override schema = z.object({
    email: z.email(),
  });
}

export default forgetPasswordDto;
