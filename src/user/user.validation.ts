import { z } from 'zod';

const createUser = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'Name must be 1 or more characters long' })
      .max(100, { message: 'Name must be 100 or fewer characters long' }),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

const getUsers = z.object({
  query: z.object({
    offset: z.string().regex(/^\d+$/, 'Offset must be a number').default('0'),
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').default('10'),
  }),
});

const getUser = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const updateUser = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'Name must be 1 or more characters long' })
      .max(100, { message: 'Name must be 100 or fewer characters long' }),
  }),
});

const deleteUser = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateUser = z.infer<typeof createUser>;
export type GetUsers = z.infer<typeof getUsers>;
export type GetUser = z.infer<typeof getUser>;
export type UpdateUser = z.infer<typeof updateUser>;
export type DeleteUser = z.infer<typeof deleteUser>;

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
