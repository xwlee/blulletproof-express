import asyncHandler from 'express-async-handler';
import httpStatus from 'http-status';

import ApiError from '../common/utils/ApiError';

import userService from './user.service';
import { CreateUser, DeleteUser, GetUser, GetUsers, UpdateUser } from './user.validation';

const createUser = asyncHandler<unknown, unknown, CreateUser['body']>(async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = await userService.createUser({
    name,
    email,
    password,
  });

  res.status(httpStatus.CREATED).json(newUser);
});

const getUsers = asyncHandler<unknown, unknown, unknown, GetUsers['query']>(async (req, res) => {
  const { page, limit } = req.query;
  const users = await userService.getUsers({
    page,
    limit,
  });
  res.status(httpStatus.OK).json({ page, limit, ...users });
});

const getUser = asyncHandler<GetUser['params']>(async (req, res) => {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  if (user === null) {
    throw new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND].toString());
  }

  res.status(httpStatus.OK).json(user);
});

const updateUser = asyncHandler<UpdateUser['params'], unknown, UpdateUser['body']>(
  async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const updatedUser = await userService.updateUserById(id, {
      name,
    });

    res.status(httpStatus.OK).json(updatedUser);
  },
);

const deleteUser = asyncHandler<DeleteUser['params']>(async (req, res) => {
  const { id } = req.params;

  await userService.deleteUserById(id);

  res.sendStatus(httpStatus.NO_CONTENT);
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
