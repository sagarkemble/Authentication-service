import sendEmail from "../../common/config/email.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateHashedToken,
  hashToken,
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

export { register, verifyEmail };
