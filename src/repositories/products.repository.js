import { prisma } from '#db/prisma.js';
import { searchWhere } from '#utils';

function getProduct(productId) {
  return prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
}

function createProduct(data) {
  return prisma.product.create({
    data,
  });
}

function updateProduct(productId, data) {
  return prisma.product.update({
    where: {
      id: productId,
    },
    data,
  });
}

function deleteProduct(productId) {
  return prisma.product.delete({
    where: {
      id: productId,
    },
  });
}

function getProductList(offset = 1, limit, sort, keyword) {
  return prisma.product.findMany({
    skip: Number(offset),
    take: Number(limit),
    where: searchWhere('name', 'description', keyword),
    orderBy: {
      name: sort,
    },
  });
}

function countProduct(keyword) {
  return prisma.product.count({
    where: searchWhere('name', 'description', keyword),
  });
}

export const product = {
  get: getProduct,
  create: createProduct,
  update: updateProduct,
  remove: deleteProduct,
  getList: getProductList,
  count: countProduct,
};
