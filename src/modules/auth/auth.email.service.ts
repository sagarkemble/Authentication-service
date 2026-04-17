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

export { sendVerificationMail };
