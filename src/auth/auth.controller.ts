import { Request, Response } from 'express';

const register = (req: Request, res: Response) => {
  return res.status(200).send('register');
};

const login = (req: Request, res: Response) => {
  return res.status(200).send('login');
};

const logout = (req: Request, res: Response) => {
  return res.status(200).send('logout');
};

const refreshTokens = (req: Request, res: Response) => {
  return res.status(200).send('refreshTokens');
};

const forgotPassword = (req: Request, res: Response) => {
  return res.status(200).send('refreshTokens');
};

const resetPassword = (req: Request, res: Response) => {
  return res.status(200).send('refreshTokens');
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
