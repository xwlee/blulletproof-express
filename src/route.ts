import express from 'express';

import authRoute from './auth';
import docsRoute from './docs';
import userRoute from './user';

const router = express.Router();

router.use('/', authRoute);
router.use('/', userRoute);
router.use('/', docsRoute);

export default router;
