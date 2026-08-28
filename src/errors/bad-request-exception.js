import { HttpException } from './http-exception.js';

export class BadRequestException extends HttpException {
  constructor(description = 'Bad Request') {
    super(400, description);
  }
}
