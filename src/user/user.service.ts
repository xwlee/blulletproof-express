import { User, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';

import ApiError from '../common/utils/ApiError';
import prisma from '../prisma';

const exclude = <User, Key extends keyof User>(user: User, ...keys: Key[]): Omit<User, Key> => {
  for (const key of keys) {
    delete user[key];
  }
  return user;
};

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

const createUser = async (data: Prisma.UserCreateInput): Promise<Omit<User, 'password'>> => {
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
  page: number;
  limit: number;
}): Promise<{
  result: Omit<User, 'password'>[];
  totalPage: number;
  totalResult: number;
}> => {
  const { page, limit } = params;
  const skip = (page - 1) * limit;

  const usersCount = await prisma.user.count();
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });
  const usersWithoutPassword = users.map((user) => exclude(user, 'password'));

  return {
    result: usersWithoutPassword,
    totalPage: Math.ceil(usersCount / limit),
    totalResult: usersCount,
  };
};

const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
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

const getUserByEmail = async (email: string): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
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
        throw new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND].toString());
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
        throw new ApiError(httpStatus.NOT_FOUND, httpStatus[httpStatus.NOT_FOUND].toString());
      }
    }
    throw e;
  }
};

const _isPasswordMatch = async (password: string, user: User): Promise<boolean> => {
  return bcrypt.compare(password, user.password);
};

const login = async (email: string, password: string): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await _isPasswordMatch(password, user))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  const userWithoutPassword = exclude(user, 'password');

  return userWithoutPassword;
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
  updateUserById,
  deleteUserById,
  login,
};
