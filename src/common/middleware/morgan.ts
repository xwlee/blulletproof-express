import { Request, Response } from 'express';
import morgan, { token, TokenIndexer } from 'morgan';

import logger from '../service/logger.service';

morgan.token('error', (_req: Request, res: Response) => res.locals.err?.stack ?? '');
morgan.token('body', (req: Request) => {
  return JSON.stringify(req.body);
});

const successResponseFormat = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response,
) => {
  return JSON.stringify({
    request: {
      remote_addr: tokens['remote-addr'](req, res),
      method: tokens['method'](req, res),
      url: tokens['url'](req, res),
      body: tokens['body'](req, res),
      status_coode: tokens['status'](req, res),
      response_time: `${tokens['response-time'](req, res)} ms`,
    },
  });
};

const errorResponseFormat = (
  tokens: TokenIndexer<Request, Response>,
  req: Request,
  res: Response,
) => {
  return JSON.stringify({
    request: {
      remote_addr: tokens['remote-addr'](req, res),
      method: tokens['method'](req, res),
      url: tokens['url'](req, res),
      body: tokens['body'](req, res),
      status_coode: tokens['status'](req, res),
      response_time: `${tokens['response-time'](req, res)} ms`,
    },
    error: tokens['error'](req, res),
  });
};

const successHandler = morgan(successResponseFormat, {
  skip: (_req, res) => res.statusCode >= 400,
  stream: {
    write: (info) => {
      logger.info(JSON.parse(info));
    },
  },
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (_req, res) => res.statusCode < 400,
  stream: {
    write: (info) => {
      logger.error(JSON.parse(info));
    },
  },
});

export default {
  successHandler,
  errorHandler,
};
