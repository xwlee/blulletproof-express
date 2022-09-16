import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import status from 'http-status';
import { z } from 'zod';

import userService from './user.service';
import userValidation from './user.validation';

const createUser = asyncHandler(
  async (
    req: Request<
      unknown,
      unknown,
      z.infer<typeof userValidation.createUser>['body']
    >,
    res: Response,
  ) => {
    const { name, email, password } = req.body;

    const newUser = await userService.createUser({
      name,
      email,
      password,
    });

    res.status(status.CREATED).json(newUser);
  },
);

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getUsers({
    skip: req.query.skip,
    take: req.query.take,
    orderBy: req.query.orderBy,
  });

  res.status(status.OK).json(users);
});

const updateUser = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, { name: string; games: string[] }>,
    res: Response,
  ) => {
    const { name } = req.body;
    const { id } = req.params;

    const updatedUser = await userService.updateUser({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(status.OK).json(updatedUser);
  },
);

const deleteUser = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, { name: string; games: string[] }>,
    res: Response,
  ) => {
    const { name } = req.body;
    const { id } = req.params;

    const updatedUser = await userService.updateUser({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(status.OK).json(updatedUser);
  },
);

export default {
  createUser,
  updateUser,
  deleteUser,
};
