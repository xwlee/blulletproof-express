import { Request, Response, NextFunction } from 'express';
import status from 'http-status';

import ApiError from '../utils/ApiError';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  res.locals.err = err;

  const statusCode =
    err instanceof ApiError ? err.statusCode : status.INTERNAL_SERVER_ERROR;
  const message =
    err instanceof ApiError
      ? err.message
      : status[status.INTERNAL_SERVER_ERROR];

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' &&
      statusCode >= 500 && { stack: err.stack }),
  };

  return res.status(statusCode).send(response);
};

export default errorHandler;
