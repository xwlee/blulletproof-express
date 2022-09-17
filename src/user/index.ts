import { Router } from 'express';

import validate from '../common/middleware/validation';

import userController from './user.controller';
import userValidation from './user.validation';

const router = Router();

router
  .route('/users')
  .post(validate(userValidation.createUser), userController.createUser)
  .get(validate(userValidation.getUsers), userController.getUsers);

router
  .route('/users/:id')
  .get(validate(userValidation.getUser), userController.getUser)
  .put(validate(userValidation.updateUser), userController.updateUser)
  .delete(validate(userValidation.deleteUser), userController.deleteUser);

export default router;
