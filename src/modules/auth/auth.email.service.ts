import resend from "../../common/config/email.config.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const emailVerificationTemplatePath = path.join(
  process.cwd(),
  "src/modules/auth/templates/emails/verify-mail.html",
);

const emailVerificationTemplate = fs.readFileSync(
  emailVerificationTemplatePath,
  "utf-8",
);

const changePasswordTemplate = fs.readFileSync(
  path.join(
    process.cwd(),
    "src/modules/auth/templates/emails/change-password.html",
  ),
  "utf-8",
);

const sendVerificationMail = async function (to: string, token: string) {
  const link = `${process.env.SERVER_BASE_URL}/auth/verify-email?token=${token}`;
  const subject = "Verify your email";

  const html = emailVerificationTemplate.replace("{{LINK}}", link);

  await resend.emails.send({
    from: "info@sagarkemble.dev",
    to,
    subject,
    html,
  });
};

const sendChangePasswordMail = async function (to: string, token: string) {
  const link = `${process.env.SERVER_BASE_URL}/auth/change-password?token=${token}`;
  const subject = "Reset your password";

  const html = changePasswordTemplate.replace("{{LINK}}", link);

  await resend.emails.send({
    from: "info@sagarkemble.dev",
    to,
    subject,
    html,
  });
};

export { sendVerificationMail, sendChangePasswordMail };
