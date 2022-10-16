import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { Schema } from 'zod';

import ApiError from '../utils/ApiError';

const validate =
  (schema: Schema) =>
  (req: Request<unknown, unknown, unknown, unknown>, _res: Response, next: NextFunction) => {
    const { params, query, body } = req;
    const result = schema.safeParse({
      params,
      query,
      body,
    });

    if (!result.success) {
      throw new ApiError(status.BAD_REQUEST, JSON.stringify(result.error.issues));
    }
    Object.assign(req, result.data);

    next();
  };

export default validate;
