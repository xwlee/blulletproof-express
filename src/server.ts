import './tracer';
import app from './app';
import logger from './common/service/logger.service';
import config from './config/config';

const server = app.listen(config.port, () =>
  logger.debug(`Server is running at http://localhost:${config.port}`),
);

const exitHandler = () => {
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(1);
  });
};

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

// ECS will send a SIGKILL after 30s which cannot be handled
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
