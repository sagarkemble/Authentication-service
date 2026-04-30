import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./auth.model";
import ApiError from "../../common/utils/api-error.utils";
import {
  compareHash,
  generateHashedToken,
  hashContent,
} from "../../common/utils/hash.utils";
import { sendVerificationEmail } from "./auth.email.service";
import { string } from "zod";

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
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  const [user] = await db
    .insert(usersTable)
    .values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpiresAt: expiresAt,
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

const verifyEmail = async function (token: string, email: string) {
  const hashedToken = await hashContent(token);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (
    !user ||
    !user.emailVerificationToken ||
    Date.now() > Number(user.emailVerificationTokenExpiresAt)
  )
    throw ApiError.badRequest("Invalid or expired token");
  const isValid = await compareHash(token, user.emailVerificationToken);

  if (!isValid) throw ApiError.badRequest("Invalid or expired token");
  await db
    .update(usersTable)
    .set({ isVerified: true, emailVerificationToken: null })
    .where(eq(usersTable.email, email));
};

export { registerUser, verifyEmail };
