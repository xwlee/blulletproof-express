import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import { Schema } from 'zod';

import ApiError from '../utils/ApiError';

const validate =
  (schema: Schema) => (req: Request, _res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { params, query, body } = req;
    const result = schema.safeParse({
      params,
      query,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      body,
    });

    if (!result.success) {
      throw new ApiError(
        status.BAD_REQUEST,
        JSON.stringify(result.error.issues),
      );
    }
    Object.assign(req, result.data);

    next();
  };

export default validate;
