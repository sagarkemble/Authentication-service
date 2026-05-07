import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  password: text("password").notNull(),
  avatarUrl: text("avatar_url").default(
    "https://ik.imagekit.io/lespresources/auth-service-avatars/default-avtar-1233321123321123321.jpg?updatedAt=1776092643846",
  ),
  avatarId: text("avatar_id"),
  refreshToken: text("refresh_token"),
  passwordResetToken: text("password_reset_token"),
  emailVerificationToken: text("email_verification_token"),
  changeEmailVerificationToken: text("change_email_verification_token"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  passwordResetTokenExpiresAt: timestamp("password_reset_token_expires_at"),
  emailVerificationTokenExpiresAt: timestamp(
    "email_verification_token_expires_at",
  ),
  changeEmailVerificationTokenExpiresAt: timestamp(
    "change_email_verification_token_expires_at",
  ),
  isVerified: boolean("is_verified").default(false),
  pendingEmail: varchar("pending_email", { length: 254 }).unique(),
  updatedAt: timestamp("updated_at"),
  createdAt: timestamp("created_at"),
});

export default usersTable;
