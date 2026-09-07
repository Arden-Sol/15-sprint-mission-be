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

function getProductList(page = 1, limit, sort = 'desc', keyword) {
  return prisma.product.findMany({
    skip: (Number(page) - 1) * limit,
    take: Number(limit),
    where: searchWhere('name', 'description', keyword),
    orderBy: [{ createdAt: sort }, { id: 'asc' }],
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
