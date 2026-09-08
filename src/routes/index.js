import express from 'express';
import { productRouter } from './products.route.js';
import { articleRouter } from './articles.route.js';
import { articleCommentRouter } from './articleComments.route.js';
import { productCommentRouter } from './productComments.route.js';

export const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'hello world',
    timeStamp: new Date().toISOString(),
  });
});

router.use('/products', productRouter);
router.use('/articles', articleRouter);
router.use('/articleComments', articleCommentRouter);
router.use('/productComments', productCommentRouter);
