import { IsActive } from './../user/user.interface';
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { generateToken, verifyToken } from "../../utils/jwt";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  const isPasswordMatched = await bcryptjs.compare(
    password as string,
    isUserExist.password as string
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!");
  }

  // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  const userTokens = createUserTokens(isUserExist);

  const { password : pass, ...rest } = isUserExist.toObject(); // remove password so that it doesnt go to frontend and creates a security issue

  return { email: isUserExist.email, accessToken: userTokens.accessToken, refreshToken: userTokens.refreshToken, user: rest };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  };
};

// user -> login -> token (email, role, _id) -> booking / payment / payment cancel -> token

export const AuthServices = {
  credentialsLogin,
  getNewAccessToken
};
