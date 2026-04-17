import { string } from "zod";
import sendEmail from "../../common/config/email.config.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateHashedToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";
import { imageKit } from "../../common/config/image-kit.config.js";
import type ImageKit from "@imagekit/nodejs";
import type { Uploadable } from "@imagekit/nodejs";
import type { Request } from "express";

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
    sendEmail(email, "Verify Your Account", rawToken);
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

const verifyEmail = async function (verificationToken: string) {
  if (!verificationToken.trim())
    throw ApiError.badRequest("Invalid or expired verification token");
  const hashedToken = hashToken(verificationToken);
  const user = await User.findOne({
    verificationToken: hashedToken,
  });

  if (!user) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invalid Token</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f5f3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: #ffffff;
      border: 0.5px solid rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 380px;
      width: 90%;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #fcebeb;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .icon-wrap svg {
      width: 28px;
      height: 28px;
    }

    h1 {
      font-size: 20px;
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    p {
      font-size: 15px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .btn {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
      background: transparent;
      border: 0.5px solid rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      padding: 10px 24px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
    }

    .btn:hover { background: #f5f5f3; }
    .btn:active { transform: scale(0.98); }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a18; }
      .card { background: #242422; border-color: rgba(255,255,255,0.1); }
      h1 { color: #f0f0ee; }
      p { color: #999; }
      .icon-wrap { background: #3d1f1f; }
      .btn { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
      .btn:hover { background: #2e2e2c; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8v4m0 4h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="#A32D2D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1>Invalid or expired token</h1>
    <p>This verification link is no longer valid. It may have expired or already been used. Request a new one to continue.</p>
    <a href="#" class="btn">Resend email</a>
  </div>
</body>
</html>`;
    return {
      type: "error",
      html,
    };
  }

  await User.findByIdAndUpdate(user._id, {
    $set: { isVerified: true },
    $unset: { verificationToken: 1 },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verified</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f5f3;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card {
      background: #ffffff;
      border: 0.5px solid rgba(0, 0, 0, 0.1);
      border-radius: 16px;
      padding: 3rem 2.5rem;
      text-align: center;
      max-width: 380px;
      width: 90%;
    }

    .icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #eaf3de;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .icon-wrap svg {
      width: 28px;
      height: 28px;
    }

    h1 {
      font-size: 20px;
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    p {
      font-size: 15px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
    }

    .btn {
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
      background: transparent;
      border: 0.5px solid rgba(0, 0, 0, 0.25);
      border-radius: 8px;
      padding: 10px 24px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.15s;
    }

    .btn:hover { background: #f5f5f3; }
    .btn:active { transform: scale(0.98); }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a18; }
      .card { background: #242422; border-color: rgba(255,255,255,0.1); }
      h1 { color: #f0f0ee; }
      p { color: #999; }
      .icon-wrap { background: #2a3d1e; }
      .btn { color: #f0f0ee; border-color: rgba(255,255,255,0.2); }
      .btn:hover { background: #2e2e2c; }
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13l4 4L19 7" stroke="#3B6D11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <h1>Email verified</h1>
    <p>Your email address has been successfully verified. You're all set.</p>
    <a href="#" class="btn">Continue</a>
  </div>
</body>
</html>`;

  return {
    type: "success",
    html,
  };
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

const changeAvatar = async function (req: Request) {
  if (!req.file) throw ApiError.badRequest("PNG/JPEG file required");
  const file = req.file;
  const params: ImageKit.FileUploadParams = {
    file: file.buffer.toString("base64"),
    fileName: `avatar-${req.user?.id}`,
    folder: "auth-service-avatars",
  };
  const avatar: ImageKit.FileUploadResponse =
    await imageKit.files.upload(params);

  const user = await User.findById(req.user?.id);
  if (user!.avatar.fileId)
    await imageKit.files.delete(user?.avatar.fileId as string);
  user!.avatar = { url: avatar.url as string, fileId: avatar.fileId as string };

  await user!.save();
  return avatar.url;
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
  changeAvatar,
};
