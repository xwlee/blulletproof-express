import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import status from 'http-status';
import { z } from 'zod';

import validate from '../common/middleware/validation';

import userController from './user.controller';
import userService from './user.service';
import userValidation from './user.validation';

const router = Router();

router.get(
  '/users',
  asyncHandler(async (_req: Request, res: Response) => {
    // const users = await userService.users({});
    // res.status(status.OK).json(users);
  }),
);

router.post(
  '/users',
  validate(userValidation.createUser),
  userController.createUser,
);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

export default router;
