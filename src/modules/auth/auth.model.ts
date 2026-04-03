import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { de } from "zod/v4/locales";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minLength: 2,
    maxLength: 50,
    trim: true,
    lowercase: true,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: 8,
    maxLength: 32,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ],
    select: false,
    default: null,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    default: null,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: { type: String, select: false, default: null },
  refreshToken: { type: String, select: false, default: null },
  resetPasswordToken: { type: String, select: false, default: null },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
