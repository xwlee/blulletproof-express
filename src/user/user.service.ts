import { User, Prisma } from '@prisma/client';

import prisma from '../prisma';

const user = async (userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: userWhereUniqueInput,
  });
};

const createUser = async (data: Prisma.UserCreateInput): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

const getUsers = async (params: {
  skip?: number;
  take?: number;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}): Promise<User[]> => {
  const { skip, take, orderBy } = params;

  return await prisma.user.findMany({
    skip,
    take,
    orderBy,
  });
};

const updateUser = async (params: {
  where: Prisma.UserWhereUniqueInput;
  data: Prisma.UserUpdateInput;
}): Promise<User> => {
  const { where, data } = params;
  return await prisma.user.update({
    data,
    where,
  });
};

const deleteUser = async (where: Prisma.UserWhereUniqueInput): Promise<User> => {
  return await prisma.user.delete({
    where,
  });
};

export default {
  user,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
