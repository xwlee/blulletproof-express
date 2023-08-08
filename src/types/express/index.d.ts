import { User } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Omit<User, 'password'>;
  }
}

interface Locals {
  err?: Error;
}

declare module 'express' {
  interface Response {
    locals: Locals;
  }
}
