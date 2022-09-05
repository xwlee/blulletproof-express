import './tracer';
import app from './app';
import logger from './common/service/logger.service';

const port = process.env.PORT || 8080;

const server = app.listen(port, () =>
  logger.debug(`Server is running at http://localhost:${port}`),
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
