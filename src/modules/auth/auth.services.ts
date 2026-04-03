import ApiError from "../../common/utils/api-error.js";
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

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const {
    password: _password,
    verificationToken,
    refreshToken,
    resetPasswordToken,
    ...safeUser
  } = user.toObject();

  return safeUser;
};

export { register };
