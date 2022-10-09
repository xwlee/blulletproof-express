import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import nodemailer from 'nodemailer';

import emailService from '../common/service/email.service';
import config from '../config/config';
import userService from '../user/user.service';

import authService from './auth.service';
import {
  ForgotPassword,
  Login,
  Logout,
  RefreshTokens,
  Register,
  ResetPassword,
} from './auth.validation';
import tokenService from './token.service';

const register = asyncHandler(
  async (req: Request<unknown, unknown, Register['body']>, res: Response) => {
    const transport = nodemailer.createTransport(config.email.smtp);
    await transport.sendMail({
      from: 'from@me.com',
      to: 'to@you.com',
      subject: 'Hello',
      text: 'Hello, Workd!',
    });

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
  },
);

const login = asyncHandler(async (req: Request<unknown, unknown, Login['body']>, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).json({
    user,
    tokens,
  });
});

const logout = asyncHandler(
  async (req: Request<unknown, unknown, Logout['body']>, res: Response) => {
    await authService.logout(req.body.refreshToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

const refreshTokens = asyncHandler(
  async (req: Request<unknown, unknown, RefreshTokens['body']>, res: Response) => {
    const tokens = await authService.refreshAuthToken(req.body.refreshToken);
    res.status(200).send({ ...tokens });
  },
);

const forgotPassword = asyncHandler(
  async (req: Request<unknown, unknown, ForgotPassword['body']>, res: Response) => {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  },
);

const resetPassword = asyncHandler(
  async (
    req: Request<unknown, unknown, ResetPassword['body'], ResetPassword['query']>,
    res: Response,
  ) => {
    await authService.resetPassword(req.query.token, req.body.password);
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
};
