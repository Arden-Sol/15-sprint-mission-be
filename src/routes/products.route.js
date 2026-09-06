import express from 'express';
import { validateRegisterProduct } from '../middlewares/validateRegisterProduct.js';
import { product } from '#repositories';
import { HTTP_STATUS } from '#constants';

export const productRouter = express.Router();

productRouter.get('/:productId', async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const result = await product.get(productId);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '상품을 찾을 수 없습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '상품을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.post('/', validateRegisterProduct, async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body ?? {};
    const data = { name, description, price, tags };
    const result = await product.create(data);

    res.status(HTTP_STATUS.CREATED).json({
      data: result,
      message: '상품이 등록되었습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.patch('/:productId', async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { name, description, price, tags } = req.body ?? {};

    const foundProduct = await product.get(productId);

    if (!foundProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '수정할 물건을 찾지 못했습니다.',
      });
    }

    if (!name && !description && !price && !tags) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: '수정할 내용을 입력해주세요',
      });
    }

    const data = { name, description, price, tags };
    const result = await product.update(productId, data);

    res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '상품 정보를 수정하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.delete('/:productId', async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const foundProduct = await product.get(productId);

    if (!foundProduct) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '삭제할 상품이 없습니다.',
      });
    }

    const result = await product.remove(productId);

    res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '상품을 삭제하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productRouter.get('/', async (req, res, next) => {
  try {
    const {
      offset = 0,
      limit = 10,
      sort = 'asc',
      keyword = '',
    } = req.query ?? {};
    let numOffset = Number(offset);
    let numLimit = Number(limit);
    const validSort = sort === 'asc' ? 'asc' : 'desc';

    if (numOffset < 1 || !Number.isInteger(numOffset)) {
      numOffset = 1;
    }
    if (numLimit < 1 || !Number.isInteger(numLimit) || numLimit > 35) {
      numLimit = 10;
    }

    const [result, totalCount] = await Promise.all([
      product.getList(numOffset, numLimit, validSort, keyword),
      product.count(keyword),
    ]);

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      totalCount,
      message: '상품 목록을 불러왔습니다.',
    });
  } catch (error) {
    next(error);
  }
});
