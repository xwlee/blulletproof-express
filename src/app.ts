import express, { Request } from 'express';
import helmet from 'helmet';
import cors from 'cors';

import userRoutes from './user';
import errorHandler from './common/middleware/error';
import morgan from './common/middleware/morgan';

const port = process.env.PORT || 8080;

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

app.use('/', userRoutes);

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
