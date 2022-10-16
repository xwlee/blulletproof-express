import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';

import emailService from '../common/service/email.service';
import userService from '../user/user.service';

import authService from './auth.service';
import {
  ForgotPassword,
  Login,
  Logout,
  RefreshTokens,
  Register,
  ResetPassword,
  VerifyEmail,
} from './auth.validation';
import tokenService from './token.service';

const register = asyncHandler<unknown, unknown, Register['body']>(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await userService.createUser({
    name,
    email,
    password,
  });
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).json({
    user,
    tokens,
  });
});

const login = asyncHandler<unknown, unknown, Login['body']>(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({
    user,
    tokens,
  });
});

const logout = asyncHandler<unknown, unknown, Logout['body']>(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const refreshTokens = asyncHandler<unknown, unknown, RefreshTokens['body']>(async (req, res) => {
  const tokens = await authService.refreshAuthToken(req.body.refreshToken);
  res.status(200).send({ ...tokens });
});

const forgotPassword = asyncHandler<unknown, unknown, ForgotPassword['body']>(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.sendStatus(httpStatus.NO_CONTENT);
});

const resetPassword = asyncHandler<unknown, unknown, ResetPassword['body'], ResetPassword['query']>(
  async (req, res) => {
    await authService.resetPassword(req.query.token, req.body.password);
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

const sendVerificationEmail = asyncHandler(async (req, res) => {
  if (req.user) {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  }
  res.sendStatus(httpStatus.NO_CONTENT);
});

const verifyEmail = asyncHandler<unknown, unknown, unknown, VerifyEmail['query']>(
  async (req, res) => {
    await authService.verifyEmail(req.query.token);
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
