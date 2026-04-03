import BaseDto from "../../../common/dto/base-dto.js";
import z from "zod";

class RegisterDto extends BaseDto {
  static schema = z.object({
    name: z.string().trim().min(2).max(50),
    email: z.email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
    role: z.enum(["user", "admin"]).default("user"),
  });
}

export default RegisterDto;
