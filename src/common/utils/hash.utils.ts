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
const compareHash = async function (hash1: string, hash2: string) {
  return await bcrypt.compare(hash1, hash2);
};
export { hashContent, generateHashedToken, compareHash };
