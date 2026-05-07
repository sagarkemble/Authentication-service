import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "../auth/auth.model";
import type User from "../../types/user";
import ApiError from "../../common/utils/api-error.utils";
import * as hashUtils from "../../common/utils/hash.utils";
import { sendVerificationEmail } from "./user.email.service";
import path from "path";
import type ImageKit from "@imagekit/nodejs";
import { imageKit } from "../../common/config/image-kit.config";

const getMe = async function (userId: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  const { id, firstName, lastName, email, avatarUrl, isVerified } =
    user as User;

  const safeUser = {
    id,
    firstName,
    lastName,
    email,
    avatarUrl,
    isVerified,
  };
  return safeUser;
};

const patchMe = async function (
  {
    firstName,
    lastName,
    avatarUrl,
  }: { firstName?: string; lastName?: string; avatarUrl?: string },
  userId: string,
) {
  const updateData = {} as {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (avatarUrl) updateData.avatarUrl = avatarUrl;
  const [updatedUser] = await db
    .update(usersTable)
    .set(updateData)
    .where(eq(usersTable.id, userId))
    .returning();
  const {
    id,
    firstName: _firstName,
    lastName: _lastName,
    email,
    avatarUrl: _avatarUrl,
    isVerified,
  } = updatedUser as User;

  const safeUser = {
    id,
    firstName: _firstName,
    lastName: _lastName,
    email,
    avatarUrl: _avatarUrl,
    isVerified,
  };
  return safeUser;
};

const deleteMe = async function (userId: string, password: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isValidPassword = await hashUtils.compareHash(password, user.password);

  if (!isValidPassword) {
    throw ApiError.unauthorized("Invalid password");
  }
  await db.delete(usersTable).where(eq(usersTable.id, userId));
  return;
};

const changeEmail = async function (
  currentPassword: string,
  newEmail: string,
  userId: string,
) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  const isValidPassword = await hashUtils.compareHash(
    currentPassword,
    user.password,
  );
  if (!isValidPassword) {
    throw ApiError.unauthorized("Invalid password");
  }

  const { token, hashedToken } = await hashUtils.generateHashedToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await db.update(usersTable).set({
    pendingEmail: newEmail,
    changeEmailVerificationToken: hashedToken,
    changeEmailVerificationTokenExpiresAt: expiresAt,
  });

  await sendVerificationEmail(newEmail, token);

  await db
    .update(usersTable)
    .set({ pendingEmail: newEmail })
    .where(eq(usersTable.id, userId));
};

const verifyEmail = async function (token: string, email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (
    !user ||
    !user.changeEmailVerificationToken ||
    Date.now() > Number(user.changeEmailVerificationTokenExpiresAt)
  )
    throw ApiError.badRequest("Invalid or expired token");
  const isValid = await hashUtils.compareHash(
    token,
    user.changeEmailVerificationToken,
  );

  if (!isValid) throw ApiError.badRequest("Invalid or expired token");
  await db
    .update(usersTable)
    .set({
      email: user.pendingEmail!,
      changeEmailVerificationToken: null,
      pendingEmail: null,
      changeEmailVerificationTokenExpiresAt: null,
    })
    .where(eq(usersTable.email, email));
};

const uploadAvatar = async function (
  file: Express.Multer.File,
  userId: string,
) {
  if (!file) throw ApiError.badRequest("PNG/JPEG file required");
  const params: ImageKit.FileUploadParams = {
    file: file.buffer.toString("base64"),
    fileName: file.originalname,
    folder: "auth-service-avatars",
  };
  const avatar: ImageKit.FileUploadResponse =
    await imageKit.files.upload(params);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);
  if (!user) throw ApiError.notFound("User not found");
  if (user.avatarId) {
    await imageKit.files.delete(user.avatarId);
  }
  await db
    .update(usersTable)
    .set({ avatarUrl: avatar.url, avatarId: avatar.fileId })
    .where(eq(usersTable.id, userId));
  return avatar.url;
};

export { getMe, patchMe, deleteMe, changeEmail, verifyEmail, uploadAvatar };
