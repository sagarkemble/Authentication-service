import { eq } from "drizzle-orm";
import db from "../../common/config/db.config";
import usersTable from "../auth/auth.model";
import type User from "../../types/user";

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

export { getMe, patchMe };
