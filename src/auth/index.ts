import { Router } from 'express';

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

export default router;
