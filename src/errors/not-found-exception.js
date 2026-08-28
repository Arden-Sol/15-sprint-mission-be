import { HttpException } from './http-exception.js';

export class NotFoundException extends HttpException {
  constructor(description = 'Not Found') {
    super(404, description);
  }
}
