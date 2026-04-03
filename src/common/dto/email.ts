import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to: string, subject: string, body: string) => {
  await resend.emails.send({
    from: "info@sagarkemble.dev",
    to: to,
    subject: subject,
    html: `<p>${body}</p>`,
  });
};

export default sendEmail;
