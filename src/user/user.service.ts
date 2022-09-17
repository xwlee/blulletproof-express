import { User, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';

import ApiError from '../common/utils/ApiError';
import prisma from '../prisma';

function exclude<User, Key extends keyof User>(
  user: User,
  ...keys: Key[]
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

const isEmailTaken = async (email: string): Promise<boolean> => {
  const count = await prisma.user.count({
    where: {
      email,
    },
  });
  if (count > 0) {
    return true;
  }
  return false;
};

const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<Omit<User, 'password'>> => {
  if (await isEmailTaken(data.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  data.password = await bcrypt.hash(data.password, 8);

  const user = await prisma.user.create({
    data,
  });

  const userWithoutPassword = exclude(user, 'password');

  return userWithoutPassword;
};

const getUsers = async (params: {
  skip?: number;
  take?: number;
}): Promise<Omit<User, 'password'>[]> => {
  const { skip, take } = params;

  const users = await prisma.user.findMany({
    skip,
    take,
    orderBy: {
      createdAt: 'desc',
    },
  });
  const usersWithoutPassword = users.map((user) => exclude(user, 'password'));

  return usersWithoutPassword;
};

const getUserById = async (
  id: string,
): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (user) {
    const userWithoutPassword = exclude(user, 'password');
    return userWithoutPassword;
  }

  return null;
};

const updateUserById = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<Omit<User, 'password'>> => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    const userWithoutPassword = exclude(user, 'password');

    return userWithoutPassword;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      // Updating a record that doesn't exist
      if (e.code === 'P2025') {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          httpStatus[httpStatus.NOT_FOUND].toString(),
        );
      }
    }
    throw e;
  }
};

const deleteUserById = async (id: string): Promise<void> => {
  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      // Deleting a record that doesn't exist
      if (e.code === 'P2025') {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          httpStatus[httpStatus.NOT_FOUND].toString(),
        );
      }
    }
    throw e;
  }
};

export default {
  createUser,
  getUserById,
  getUsers,
  updateUserById,
  deleteUserById,
};
