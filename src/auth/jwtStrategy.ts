import { TokenType } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { VerifyCallback } from 'passport-jwt';

import config from '../config/config';
import userService from '../user/user.service';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify: VerifyCallback = async (payload: JwtPayload, done) => {
  try {
    if (payload.type === TokenType.ACCESS) {
      throw new Error('Invalid token type');
    }
    if (payload.sub) {
      const user = await userService.getUserById(payload.sub);
      if (user) {
        return done(null, user);
      }
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
