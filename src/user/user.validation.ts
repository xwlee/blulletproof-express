import { z } from 'zod';

const createUser = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

const getUsers = z.object({
  query: z.object({
    offset: z.string().regex(/^\d+$/, 'Must be a number').default('0'),
    limit: z.string().regex(/^\d+$/, 'Must be a number').default('10'),
  }),
});

export default {
  createUser,
  getUsers,
};
