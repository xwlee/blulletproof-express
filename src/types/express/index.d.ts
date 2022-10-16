import { User } from '@prisma/client';

interface Locals {
  err?: Error;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
  interface Response {
    locals: Locals;
  }
}
