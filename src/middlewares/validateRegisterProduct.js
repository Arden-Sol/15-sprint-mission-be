import { HTTP_STATUS } from '#constants';

export const validateRegisterProduct = (req, res, next) => {
  const { name, description, price, tags } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    name.trim().length > 10 ||
    name.trim().length <= 0
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: '이름은 10자 이내로 입력해주세요.',
    });
  }

  if (
    typeof description !== 'string' ||
    description.trim().length > 100 ||
    description.trim().length <= 0
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: '설명은 1자 이상 100자 이하로 입력해주세요.',
    });
  }

  if (
    typeof price !== 'number' ||
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isInteger(price)
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: '가격은 0보다 큰 정수로 입력해주세요',
    });
  }

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    !tags.every((tag) => typeof tag === 'string')
  ) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: '태그는 하나 이상 입력해주세요',
    });
  }

  next();
};
