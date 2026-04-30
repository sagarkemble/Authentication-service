import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "./auth.model";
import ApiError from "../../common/utils/api-error.utils";
import {
  compareHash,
  generateHashedToken,
  hashContent,
} from "../../common/utils/hash.utils";
import {
  sendForgotPasswordEmail,
  sendVerificationEmail,
} from "./auth.email.service";
import { generateJwtToken, verifyJwtToken } from "../../common/utils/jwt.utils";

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

const login = async function name(email: string, password: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) throw ApiError.notFound("User not found");
  if (!user.isVerified) throw ApiError.unauthorized("Email not verified");
  const isPasswordValid = await compareHash(password, user.password);
  if (!isPasswordValid) throw ApiError.unauthorized("Invalid credentials");
  await db;
  const refreshToken = await generateJwtToken({
    userId: user.id,
    email: user.email,
  });
  const accessToken = await generateJwtToken({
    userId: user.id,
    email: user.email,
  });
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    refreshToken,
    accessToken,
  };
};

const logout = async function (refreshToken: string) {
  await db
    .update(usersTable)
    .set({ refreshToken: null })
    .where(eq(usersTable.refreshToken, refreshToken));
};
const refreshToken = async function (token: string) {
  const decoded = (await verifyJwtToken(token)) as {
    userId: string;
    email: string;
  };
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, decoded.userId));
  if (!user || !user.refreshToken)
    throw ApiError.unauthorized("Invalid refresh token");

  const isValid = await compareHash(token, user.refreshToken!);
  if (!isValid) throw ApiError.unauthorized("Invalid refresh token");

  const accessToken = await generateJwtToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = await generateJwtToken({
    userId: user.id,
    email: user.email,
  });
  await db
    .update(usersTable)
    .set({ refreshToken })
    .where(eq(usersTable.id, user.id));
  return {
    refreshToken,
    accessToken,
  };
};

const forgotPassword = async function (email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!user) throw ApiError.notFound("User not found");
  const { token, hashedToken } = await generateHashedToken();
  await db
    .update(usersTable)
    .set({
      passwordResetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      passwordResetToken: hashedToken,
    })
    .where(eq(usersTable.email, email));
  await sendForgotPasswordEmail(email, token);
};

const resetPassword = async function (
  token: string,
  email: string,
  newPassword: string,
) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (!user || !user.passwordResetToken) {
    throw ApiError.badRequest("Invalid or expired token");
  }
  const isValid = await compareHash(token, user.passwordResetToken);
  if (!isValid) throw ApiError.badRequest("Invalid or expired token");
  const hashedPassword = await hashContent(newPassword);
  await db
    .update(usersTable)
    .set({
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    })
    .where(eq(usersTable.email, email));
};

const changePassword = async function (
  userId: string,
  oldPassword: string,
  newPassword: string,
) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) throw ApiError.notFound("User not found");
  const isOldPasswordValid = await compareHash(oldPassword, user.password);
  if (!isOldPasswordValid) throw ApiError.unauthorized("Invalid old password");
  const hashedPassword = await hashContent(newPassword);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, userId));
};

export {
  registerUser,
  verifyEmail,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
