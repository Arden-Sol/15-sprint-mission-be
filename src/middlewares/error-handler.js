import { HttpException } from '../errors/http-exception.js';

export const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpException) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.log('error', error);

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
