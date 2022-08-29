import morgan from 'morgan';
import logger from '../../logger';
import { Request, Response } from 'express';

morgan.token(
  'message',
  (_req: Request, res: Response) => res.locals.errorMessage || '',
);
morgan.token('body', (req: Request) => {
  return JSON.stringify(req.body);
});

const getIpFormat = () => ':remote-addr - ';
const successResponseFormat = `${getIpFormat()}:method :url :body :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :body :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

export default {
  successHandler,
  errorHandler,
};
