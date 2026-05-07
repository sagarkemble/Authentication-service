import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

export default class changeEmailDto extends BaseDto {
  static override schema = z
    .object({
      newEmail: z.email("Invalid email").trim().toLowerCase(),
      password: z
        .string()
        .min(8, "Invalid password")
        .max(32, "Invalid password")
        .regex(/[A-Z]/, "Invalid password")
        .regex(/[a-z]/, "Invalid password")
        .regex(/[0-9]/, "Invalid password")
        .regex(/[@$!%*?&]/, "Invalid password"),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    });
}
