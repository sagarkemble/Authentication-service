import { string } from "zod";
import sendEmail from "../../common/config/email.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateHashedToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

const register = async function ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const emailExists = await User.findOne({ email });
  if (emailExists) throw ApiError.conflict("Email Already Exists");
  const { rawToken, hashedToken } = await generateHashedToken();

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });

  try {
    sendEmail(
      email,
      "Verify Your Account",
      `Your verification token is: ${rawToken}`,
    );
  } catch (error) {
    throw ApiError.badRequest("Failed to send verification email");
  }

  const {
    password: _password,
    verificationToken,
    refreshToken,
    resetPasswordToken,
    ...safeUser
  } = user.toObject();

  return safeUser;
};

const verifyEmail = async function ({
  verificationToken,
}: {
  verificationToken: string;
}) {
  if (!verificationToken.trim())
    throw ApiError.badRequest("Invalid or expired verification token");
  const hashedToken = hashToken(verificationToken);
  const user = await User.findOne({
    verificationToken: hashedToken,
  });

  if (!user) throw ApiError.badRequest("Invalid or expired verification token");

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  const {
    password: _password,
    verificationToken: _verificationToken,
    refreshToken,
    resetPasswordToken,
    ...safeUser
  } = user.toObject();

  return safeUser;
};

const login = async function ({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await User.findOne({ email })
    .select("+password")
    .select("+verificationToken");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword)
    throw ApiError.unauthorized("Invalid email or password");

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });
  const {
    password: _password,
    verificationToken: _verificationToken,
    refreshToken: _refreshToken,
    resetPasswordToken,
    ...userObj
  } = user.toObject();

  return {
    userObj,
    refreshToken,
    accessToken,
  };
};

const refreshAccessToken = async function (refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken) as { id: string };
  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) throw ApiError.unauthorized("Invalid refresh token");

  const hashedRefreshToken = hashToken(refreshToken);
  if (hashedRefreshToken !== user.refreshToken)
    throw ApiError.unauthorized("Invalid refresh token");

  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  user.refreshToken = hashToken(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async function (userId: string) {
  await User.findOneAndUpdate({ _id: userId }, { refreshToken: null });
};

const getMe = async function (id: string) {
  const user = await User.findById(id);
  return user;
};

const forgotPassword = async function ({ email }: { email: string }) {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.unauthorized("Invalid email");
  const { rawToken, hashedToken } = generateHashedToken();
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
  user.resetPasswordToken = hashedToken;
  await user.save();
  await sendEmail(
    email,
    "Reset Your Password",
    `Your password reset token is: ${rawToken}`,
  );
};

const resetPassword = async function ({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const hashedToken = hashToken(token);
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};

export {
  register,
  verifyEmail,
  login,
  refreshAccessToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
};
