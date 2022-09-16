import express from 'express';

import authRoute from './auth';
import userRoute from './user';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/', userRoute);

export default router;
