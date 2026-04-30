import bcrypt from "bcryptjs";
import crypto from "crypto";

const hashContent = async function (content: string) {
  return await bcrypt.hash(content, 12);
};
const generateHashedToken = async function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(token, 12);
  return { token, hashedToken };
};
export { hashContent, generateHashedToken };
