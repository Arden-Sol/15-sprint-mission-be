import { prisma } from '#db/prisma.js';

function getProductComment(productCommentId) {
  return prisma.productComment.findUnique({
    where: {
      id: productCommentId,
    },
  });
}

function createProductComment(content) {
  return prisma.productComment.create({
    data: {
      content,
    },
  });
}

function updateProductComment(productCommentId, content) {
  return prisma.productComment.update({
    where: {
      id: productCommentId,
    },
    data: {
      content,
    },
  });
}

function deleteProductComment(productCommentId) {
  return prisma.productComment.delete({
    where: {
      id: productCommentId,
    },
  });
}

function getProductCommentList(limit, cursorId, sort = 'asc', keyword = '') {
  return prisma.productComment.findMany({
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

export const productComment = {
  get: getProductComment,
  create: createProductComment,
  update: updateProductComment,
  remove: deleteProductComment,
  getList: getProductCommentList,
};
