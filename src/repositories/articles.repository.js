import { prisma } from '#db/prisma.js';
import { searchWhere } from '#utils';

function getArticle(articleId) {
  return prisma.article.findUnique({
    where: {
      id: articleId,
    },
  });
}

function createArticle(title, content) {
  return prisma.article.create({
    data: {
      title,
      content,
    },
  });
}

function updateArticle(articleId, data) {
  return prisma.article.update({
    where: {
      id: articleId,
    },
    data,
  });
}

function deleteArticle(articleId) {
  return prisma.article.delete({
    where: {
      id: articleId,
    },
  });
}

function getArticleList(offset = 1, limit = 10, sort = 'desc', keyword = '') {
  return prisma.article.findMany({
    skip: Number(offset),
    take: Number(limit),
    where: searchWhere('title', 'content', keyword),
    orderBy: {
      title: sort,
    },
  });
}

function countArticle(keyword) {
  return prisma.article.count({
    where: searchWhere('title', 'content', keyword),
  });
}

export const article = {
  get: getArticle,
  create: createArticle,
  update: updateArticle,
  remove: deleteArticle,
  getList: getArticleList,
  count: countArticle,
};
