import path from "path";
import { resend } from "../../common/config/email.config";
import fs from "fs/promises";

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

export { sendVerificationEmail };
