import cors from 'cors';
import express, { Request } from 'express';
import helmet from 'helmet';
import status from 'http-status';

import authRoute from './auth';
import errorHandler from './common/middleware/error';
import morgan from './common/middleware/morgan';
import ApiError from './common/utils/ApiError';
import userRoute from './user';

const app = express();

// Log HTTP request
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.disable('x-powered-by');

app.enable('trust proxy');

// Enable CORS
app.use(cors());
app.options('*', cors<Request>());

// Parse JSON request body
app.use(express.json());

// Set various security HTTP headers
app.use(helmet());

app.use('/', userRoute);
app.use('/', authRoute);

// Handle error
app.use(errorHandler);

// Handle unknown request
app.use((_req, _res, next) => {
  next(new ApiError(status.NOT_FOUND, 'Not found'));
});

export default app;
