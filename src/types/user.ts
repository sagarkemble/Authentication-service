export default interface User {
  id: string;

  firstName: string;
  lastName: string;

  email: string;
  password: string;

  avatarUrl: string | null;
  avatarId: string | null;

  refreshToken: string | null;

  passwordResetToken: string | null;
  emailVerificationToken: string | null;
  changeEmailVerificationToken: Date | null;

  refreshTokenExpiresAt: Date | null;
  passwordResetTokenExpiresAt: Date | null;
  emailVerificationTokenExpiresAt: Date | null;
  changeEmailVerificationTokenExpiresAt: Date | null;

  isVerified: boolean | null;

  pendingEmail: string | null;

  updatedAt: Date | null;
  createdAt: Date | null;
}
