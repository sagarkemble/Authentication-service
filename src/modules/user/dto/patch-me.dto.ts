import z from "zod";
import BaseDto from "../../../common/dto/base.dto";

export default class patchMeDto extends BaseDto {
  static override schema = z
    .object({
      firstName: z
        .string()
        .min(3, "First name must be at least 3 characters")
        .max(50, "First name must be at most 50 characters")
        .trim()
        .toLowerCase()
        .optional(),
      lastName: z
        .string()
        .min(3, "Last name must be at least 3 characters")
        .max(50, "Last name must be at most 50 characters")
        .trim()
        .toLowerCase()
        .optional(),
      avatarUrl: z.url("Invalid avatar URL").optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    });
}
