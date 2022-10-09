import { TokenType, User } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../common/utils/ApiError';
import prisma from '../prisma';
import userService from '../user/user.service';

import tokenService from './token.service';

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<Omit<User, 'password'>> => {
  const user = await userService.login(email, password);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenDoc = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND].toString());
  }
  await prisma.token.delete({
    where: {
      id: refreshTokenDoc.id,
    },
  });
};

const refreshAuthToken = async (refreshToken: string) => {
  const refreshTokenDoc = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
  const user = await userService.getUserById(refreshTokenDoc.userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  await prisma.token.delete({
    where: {
      id: refreshTokenDoc.id,
    },
  });
  return tokenService.generateAuthTokens(user);
};

const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  const resetPasswordkTokenDoc = await tokenService.verifyToken(
    resetPasswordToken,
    TokenType.RESET_PASSWORD,
  );
  const user = await userService.getUserById(resetPasswordkTokenDoc.userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, ' Password reset failed');
  }
  await userService.updateUserById(user.id, { password: newPassword });
  await prisma.token.deleteMany({
    where: {
      userId: user.id,
      type: TokenType.RESET_PASSWORD,
    },
  });
};

export default {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuthToken,
  resetPassword,
};
