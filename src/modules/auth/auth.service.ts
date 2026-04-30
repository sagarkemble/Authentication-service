import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./auth.model";
import ApiError from "../../common/utils/api-error.utils";
import {
  generateHashedToken,
  hashContent,
} from "../../common/utils/hash.utils";
import { sendVerificationEmail } from "./auth.email.service";

const registerUser = async function (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (existingUser.length > 0)
    throw ApiError.conflict("User with this email already exists");

  const hashedPassword = await hashContent(password);
  const { token, hashedToken } = await generateHashedToken();
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
    })
    .returning();

  await sendVerificationEmail(email, token);

  return {
    firstName: user!.firstName,
    lastName: user!.lastName,
    email: user!.email,
    isVerified: user!.isVerified,
  };
};

export { registerUser };
