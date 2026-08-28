import { BadRequestException } from '../errors/bad-request-exception.js';

export const validId = (req, res, next) => {
  const productId = Number(req.params.productId);
  if (
    typeof productId !== 'number' ||
    !Number.isFinite(productId) ||
    productId <= 0 ||
    Number.isInteger(productId)
  ) {
    throw new BadRequestException('유효한 숫자를 입력해주세요');
  }

  next();
};
