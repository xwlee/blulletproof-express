import { Request, Response, NextFunction, Router } from 'express';
import status from 'http-status';

import ApiError from '../common/utils/ApiError';

// import { signup } from './user-service';

const router = Router();

router.get('/user', (_req: Request, _res: Response, next: NextFunction) => {
  // try {
  // throw new Error('invalid');
  throw new ApiError(status.NOT_FOUND, 'User not found!!');
  // } catch (e) {
  // next(e);
  // }
});

router.post('/user', (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(status.OK).send();
  } catch (e) {
    next(e);
  }
});

export default router;
