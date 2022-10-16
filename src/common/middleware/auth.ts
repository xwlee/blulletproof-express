import { User } from '@prisma/client';
import type { Request } from 'express';
import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';
import passport from 'passport';

import ApiError from '../utils/ApiError';

const verifyCallback =
  (req: Request, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void) =>
  (err: Error, user: User) => {
    if (err || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    req.user = user;
    resolve();
  };

const auth = () =>
  asyncHandler(async (req, res) => {
    await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject),
      )(req, res);
    });
  });

export default auth;
