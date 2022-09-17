import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import status from 'http-status';

import ApiError from '../common/utils/ApiError';

import userService from './user.service';
import {
  CreateUser,
  DeleteUser,
  GetUser,
  GetUsers,
  UpdateUser,
} from './user.validation';

const createUser = asyncHandler(
  async (req: Request<unknown, unknown, CreateUser['body']>, res: Response) => {
    const { name, email, password } = req.body;

    const newUser = await userService.createUser({
      name,
      email,
      password,
    });

    res.status(status.CREATED).json(newUser);
  },
);

const getUsers = asyncHandler(
  async (
    req: Request<unknown, unknown, unknown, GetUsers['query']>,
    res: Response,
  ) => {
    const { offset, limit } = req.query;
    const users = await userService.getUsers({
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
    });
    res.status(status.OK).json(users);
  },
);

const getUser = asyncHandler(
  async (req: Request<GetUser['params']>, res: Response) => {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(status.OK).json(user);
  },
);

const updateUser = asyncHandler(
  async (
    req: Request<UpdateUser['params'], unknown, UpdateUser['body']>,
    res: Response,
    next: NextFunction,
  ) => {
    const { id } = req.params;
    const { name } = req.body;

    const updatedUser = await userService.updateUserById(id, {
      name,
    });

    res.status(status.OK).json(updatedUser);
  },
);

const deleteUser = asyncHandler(
  async (req: Request<DeleteUser['params']>, res: Response) => {
    const { id } = req.params;

    await userService.deleteUserById(id);

    res.status(status.NO_CONTENT);
  },
);

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
