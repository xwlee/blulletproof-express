import { Request, Response, NextFunction, Router } from 'express';
import ApiError from '../common/utils/ApiError';
import { signup } from './user-service';
import status from 'http-status';

const route = Router();

route.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    throw new Error('User not found!');
    throw new ApiError(status.NOT_FOUND, 'User not found!');
  } catch (e) {
    next(e);
  }
});

route.post('/user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(status.OK).send();
  } catch (e) {
    next(e);
  }
});

export default route;
