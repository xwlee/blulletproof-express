import path from 'path';

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Config = z.object({
  env: z.enum(['production', 'development', 'test']),
  port: z.number(),
  jwt: z.object({
    secret: z.string(),
    accessExpirationMinutes: z.number(),
    refreshExpirationDays: z.number(),
    resetPasswordExpirationMinutes: z.number(),
    verifyEmailExpirationMinutes: z.number(),
  }),
  email: z.object({
    smtp: z.object({
      host: z.string(),
      port: z.number(),
      auth: z.object({
        user: z.string(),
        pass: z.string(),
      }),
    }),
    from: z.string(),
  }),
});

const validation = Config.safeParse({
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: Number(process.env.JWT_ACCESS_EXPIRATION_MINUTES) || 30,
    refreshExpirationDays: Number(process.env.JWT_REFRESH_EXPIRATION_DAYS) || 30,
    resetPasswordExpirationMinutes: Number(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES) || 10,
    verifyEmailExpirationMinutes: Number(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES) || 10,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
});

if (!validation.success) {
  throw new Error(`Config validation error: ${JSON.stringify(validation.error.issues)}`);
}

export default validation.data;
