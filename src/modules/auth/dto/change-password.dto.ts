import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

class changePasswordDto extends BaseDto {
  static override schema = z.object({
    oldPassword: z
      .string()
      .min(8, "Invalid old password")
      .max(32, "Invalid old password")
      .regex(/[A-Z]/, "Invalid old password")
      .regex(/[a-z]/, "Invalid old password")
      .regex(/[0-9]/, "Invalid old password")
      .regex(/[@$!%*?&]/, "Invalid old password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&]/, "Must contain at least one special character"),
  });
}

export default changePasswordDto;
