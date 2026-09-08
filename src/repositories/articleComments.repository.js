import { prisma } from '#db/prisma.js';

function getArticleComment(articleCommentId) {
  return prisma.articleComment.findUnique({
    where: {
      id: articleCommentId,
    },
  });
}

function createArticleComment(content) {
  return prisma.articleComment.create({
    data: {
      content,
    },
  });
}

function updateArticleComment(articleCommentId, content) {
  return prisma.articleComment.update({
    where: {
      id: articleCommentId,
    },
    data: {
      content,
    },
  });
}

function deleteArticleComment(articleCommentId) {
  return prisma.articleComment.delete({
    where: {
      id: articleCommentId,
    },
  });
}

function getArticleCommentList(limit, cursorId, sort = 'asc', keyword = '') {
  return prisma.articleComment.findMany({
    take: limit,
    ...(cursorId && {
      skip: 1,
      cursor: { id: Number(cursorId) },
    }),
    where: {
      content: {
        contains: keyword,
        mode: 'insensitive',
      },
    },
    orderBy: [{ createdAt: sort }, { id: 'asc' }],
  });
}

export const articleComment = {
  get: getArticleComment,
  create: createArticleComment,
  update: updateArticleComment,
  remove: deleteArticleComment,
  getList: getArticleCommentList,
};
