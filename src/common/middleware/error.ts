import { Request, Response, NextFunction } from 'express';
import logger from '../../logger';
import status from 'http-status';
import ApiError from '../utils/ApiError';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.errorMessage = err.stack;

  const statusCode =
    err instanceof ApiError ? err.statusCode : status.INTERNAL_SERVER_ERROR;
  const message =
    err instanceof ApiError
      ? err.message
      : status[status.INTERNAL_SERVER_ERROR];

  const response = {
    code: statusCode,
    message,
    stack: err.stack,
  };

  return res.status(statusCode).send(response);
};

export default errorHandler;
