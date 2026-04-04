import z from "zod";
import BaseDto from "../../../common/dto/base-dto.js";

class logoutDto extends BaseDto {
  static schema = z.object({
    userId: z.string(),
  });
}

export default logoutDto;
