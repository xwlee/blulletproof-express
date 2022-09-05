import 'express';

interface Locals {
  err?: Error;
}

declare module 'express' {
  export interface Response {
    locals: Locals;
  }
}
