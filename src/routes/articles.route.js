import express from 'express';
import { article } from '#repositories';
import { HTTP_STATUS } from '#constants';

export const articleRouter = express.Router();

articleRouter.get('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const result = await article.get(articleId);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '게시물을 찾을 수 없습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '게시물을 찾았습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.post('/', async (req, res, next) => {
  try {
    const { title, content } = req.body ?? {};

    if (!title || !content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: '제목과 내용을 입력해주세요.',
      });
    }

    const result = await article.create(title, content);

    return res.status(HTTP_STATUS.CREATED).json({
      data: result,
      message: '게시물을 등록했습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.patch('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    const { title, content } = req.body ?? {};

    const foundArticle = await article.get(articleId);

    if (!foundArticle) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '게시물을 찾을 수 없습니다.',
      });
    }

    if (!title && !content) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: '제목과 내용을 입력해주세요.',
      });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;

    const result = await article.update(articleId, data);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '수정할 게시글을 찾을 수 없습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '게시글을 수정하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.delete('/:articleId', async (req, res, next) => {
  try {
    const articleId = req.params.articleId;

    const foundArticle = await article.get(articleId);

    if (!foundArticle) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '게시물을 찾을 수 없습니다.',
      });
    }

    const result = await article.remove(articleId);

    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: '삭제할 게시글을 찾지 못했습니다.',
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      message: '게시글을 삭제하였습니다.',
    });
  } catch (error) {
    next(error);
  }
});

articleRouter.get('/', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'desc',
      keyword = '',
    } = req.query ?? {};
    let numPage = Number(page);
    let numLimit = Number(limit);
    const validSort = sort === 'asc' ? 'asc' : 'desc';

    if (numPage < 1 || !Number.isInteger(numPage)) {
      numPage = 1;
    }
    if (numLimit < 1 || !Number.isInteger(numLimit) || numLimit > 35) {
      numLimit = 10;
    }

    const [result, totalCount] = await Promise.all([
      article.getList(numPage, numLimit, validSort, keyword),
      article.count(keyword),
    ]);

    return res.status(HTTP_STATUS.OK).json({
      data: result,
      totalCount,
      message: '게시물 목록을 불러왔습니다.',
    });
  } catch (error) {
    next(error);
  }
});
