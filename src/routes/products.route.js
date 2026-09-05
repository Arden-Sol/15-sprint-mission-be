import express from 'express';
import { NotFoundException } from '../errors/not-found-exception.js';
import { validateRegisterProduct } from '../middlewares/validateRegisterProduct.js';
import { Products } from '../models/product.model.js';
import { BadRequestException } from '../errors/bad-request-exception.js';
import { validId } from '../middlewares/validId.js';

export const productRouter = express.Router();

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

productRouter.get('/', async (req, res) => {
  const {
    offset = 0,
    limit = 10,
    sort = 'asc',
    keyword = '',
  } = req.query ?? {};

  try {
    const filter = keyword
      ? {
          $or: [
            { name: { $regex: escapeRegex(keyword), $options: 'i' } },
            { description: { $regex: escapeRegex(keyword), $options: 'i' } },
          ],
        }
      : {};

    const totalCount = await Products.countDocuments(filter);
    if (offset < 1 || !Number.isInteger(offset)) {
      offset = 1;
    }
    if (limit < 1 || !Number.isInteger(limit)) {
      limit = 10;
    }
    const products = await Products.find(filter)
      .sort({
        updatedAt: sort,
      })
      .skip(Number(offset))
      .limit(Number(limit));

    res.status(200).json({
      list: products,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

productRouter.get('/:productId', validId, async (req, res) => {
  try {
    const product = await Products.findById(req.params.productId);

    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

productRouter.post('/', validateRegisterProduct, async (req, res) => {
  const { name, description, price, tags } = req.body ?? {};

  try {
    const newProduct = new Products({ name, description, price, tags });
    await newProduct.save();

    res.status(201).json({
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

productRouter.patch('/:productId', validId, async (req, res) => {
  const { name, description, price, tags } = req.body ?? {};

  try {
    const product = await Products.findById(req.params.productId);

    if (!product) {
      throw new NotFoundException('수정할 물건을 찾지 못했습니다.');
    }

    if (!name && !description && !price && !tags) {
      throw new BadRequestException('수정할 내용을 입력해주세요');
    }

    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    if (tags && tags.length !== 0) {
      product.tags = [...tags];
    }

    await product.save();

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

productRouter.delete('/:productId', validId, async (req, res) => {
  try {
    const product = await Products.findById(req.params.productId);

    if (!product) {
      throw new NotFoundException('삭제할 상품이 없습니다.');
    }

    await product.deleteOne();
    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    throw error;
  }
});
