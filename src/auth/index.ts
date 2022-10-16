import { Router } from 'express';

import auth from '../common/middleware/auth';
import validate from '../common/middleware/validation';

import authController from './auth.controller';
import authValidation from './auth.validation';

const router = Router();

router.post('/auth/register', validate(authValidation.register), authController.register);
router.post('/auth/login', validate(authValidation.login), authController.login);
router.post('/auth/logout', validate(authValidation.logout), authController.logout);
router.post(
  '/auth/refresh-tokens',
  validate(authValidation.refreshTokens),
  authController.refreshTokens,
);
router.post(
  '/auth/forgot-password',
  validate(authValidation.forgotPassword),
  authController.forgotPassword,
);
router.post('/auth/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/auth/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;
