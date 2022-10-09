import { z } from 'zod';

const register = z.object({
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
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

const logout = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const refreshTokens = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

const forgotPassword = z.object({
  body: z.object({
    email: z.string(),
  }),
});

const resetPassword = z.object({
  query: z.object({
    token: z.string(),
  }),
  body: z.object({
    password: z.string(),
  }),
});

export type Register = z.infer<typeof register>;
export type Login = z.infer<typeof login>;
export type Logout = z.infer<typeof logout>;
export type RefreshTokens = z.infer<typeof refreshTokens>;
export type ForgotPassword = z.infer<typeof forgotPassword>;
export type ResetPassword = z.infer<typeof resetPassword>;

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
