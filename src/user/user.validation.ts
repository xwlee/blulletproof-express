import { z } from 'zod';

const createUser = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

export default {
  createUser,
};
