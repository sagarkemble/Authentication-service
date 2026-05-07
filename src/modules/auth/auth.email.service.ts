import fs from "fs/promises";
import path from "path";
import { resend } from "../../common/config/email.config";

const verificationTemplatePath = path.resolve(
  "src",
  "modules",
  "auth",
  "templates",
  "email",
  "verification-email.html",
);
const verificationTemplate = await fs.readFile(
  verificationTemplatePath,
  "utf-8",
);

const forgotPasswordTemplatePath = path.resolve(
  "src",
  "modules",
  "auth",
  "templates",
  "email",
  "forgot-password.html",
);
const forgotPasswordTemplate = await fs.readFile(
  forgotPasswordTemplatePath,
  "utf-8",
);

const sendVerificationEmail = async function (to: string, token: string) {
  const verificationLink = `${process.env.SERVER_URL}/auth/verify-email?token=${token}&email=${to}`;
  const emailContent = verificationTemplate.replace("{link}", verificationLink);
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: "Verify your email",
    html: emailContent,
  });
};

const sendForgotPasswordEmail = async function (to: string, token: string) {
  const resetLink = `${process.env.SERVER_URL}/auth/reset-password?token=${token}&email=${to}`;
  const emailContent = forgotPasswordTemplate.replace("{link}", resetLink);
  await resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: "Reset your password",
    html: emailContent,
  });
};

export { sendVerificationEmail, sendForgotPasswordEmail };
