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

export { getMe };
