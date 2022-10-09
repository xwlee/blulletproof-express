import { Token, TokenType, User } from '@prisma/client';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import type { Moment } from 'moment';

import ApiError from '../common/utils/ApiError';
import config from '../config/config';
import prisma from '../prisma';
import userService from '../user/user.service';

const _generateToken = (
  userId: string,
  expires: Moment,
  type: string,
  secret = config.jwt.secret,
): string => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (
  token: string,
  userId: string,
  expires: Moment,
  type: Token['type'],
  blacklisted = false,
) => {
  return await prisma.token.create({
    data: {
      token,
      userId,
      expires: expires.toDate(),
      type,
      blacklisted,
    },
  });
};

const verifyToken = async (token: string, type: Token['type']) => {
  const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
  const tokenDoc = await prisma.token.findFirst({
    where: {
      token,
      type,
      userId: payload.sub,
      blacklisted: false,
    },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (user: Omit<User, 'password'>) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = _generateToken(user.id, accessTokenExpires, TokenType.ACCESS);
  await saveToken(accessToken, user.id, accessTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = _generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }

  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = _generateToken(user.id, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TokenType.RESET_PASSWORD);

  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: Omit<User, 'password'>): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = _generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);

  return verifyEmailToken;
};

export default {
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
