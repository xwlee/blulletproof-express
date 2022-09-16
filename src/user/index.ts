import { Router } from 'express';

import validate from '../common/middleware/validation';

import userController from './user.controller';
import userValidation from './user.validation';

const router = Router();

router.get('/users', validate(userValidation.getUsers), userController.getUsers);

router.post('/users', validate(userValidation.createUser), userController.createUser);

router.put('/users/:id', userController.updateUser);

router.delete('/users/:id', userController.deleteUser);

export default router;
