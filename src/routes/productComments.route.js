import express from 'express';
import { HTTP_STATUS } from '#constants';
import { productComment } from '#repositories';

export const productCommentRouter = express.Router();

productCommentRouter.post('/', async (req, res, next) => {
  try {
    const content = req.body.content ?? '';

    if (!content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: '내용을 입력해주세요',
      });
    }

    const result = await productComment.create(content);

    return res.status(HTTP_STATUS.CREATED).json({
      data: result,
      message: '상품평 댓글을 등록했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.patch('/:productCommentId', async (req, res, next) => {
  try {
    const productCommentId = req.params.productCommentId;
    const content = req.body.content ?? {};

    if (!content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: '내용을 입력해주세요',
      });
    }

    const foundProductComment = await productComment.get(productCommentId);

    if (!foundProductComment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '상품평 댓글을 찾을 수 없습니다.',
      });
    }

    const result = await productComment.update(productCommentId, content);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '수정할 댓글을 찾을 수 없습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '상품평 댓글을 수정하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.delete('/:productCommentId', async (req, res, next) => {
  try {
    const productCommentId = req.params.productCommentId;

    const foundProductComment = await productComment.get(productCommentId);

    if (!foundProductComment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '상품평 댓글을 찾을 수 없습니다.',
      });
    }

    const result = await productComment.remove(productCommentId);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '삭제할 상품평 댓글을 찾을 수 없습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '상품평 댓글을 삭제하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

productCommentRouter.get('/', async (req, res, next) => {
  try {
    const { cursorId, limit, sort = 'asc', keyword = '' } = req.query ?? {};

    let numCursorId;
    if (cursorId !== undefined) {
      numCursorId = Number(cursorId);
      if (numCursorId < 1 || !Number.isInteger(numCursorId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'Invalid cursorId or limit',
        });
      }
    }

    let numLimit = Number(limit);

    if (numLimit < 1 || !Number.isInteger(numLimit) || numLimit > 35) {
      numLimit = 10;
    }

    const validSort = sort === 'asc' ? 'asc' : 'desc';

    const result = await productComment.getList(
      numLimit,
      numCursorId,
      validSort,
      keyword,
    );

    const nextCursor = result.length > 0 ? result[result.length - 1].id : null;

    return res.status(HTTP_STATUS.OK).json({
      message: '댓글 목록을 불러왔습니다.',
      data: result,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
});
