import { password } from "bun";
import BaseDto from "../../../common/dto/base.dto";
import z from "zod";

class registerDto extends BaseDto {
  static override schema = z.object({
    firstName: z
      .string()
      .min(3, "First name must be at least 3 characters")
      .max(50, "First name must be at most 50 characters")
      .trim()
      .toLowerCase(),
    lastName: z
      .string()
      .min(3, "Last name must be at least 3 characters")
      .max(50, "Last name must be at most 50 characters")
      .trim()
      .toLowerCase(),
    email: z.email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&]/, "Must contain at least one special character"),
  });
}
export default registerDto;
