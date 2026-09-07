import { PrismaClient } from '#generated/prisma/client.ts';
import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { assertSafeSeedTarget, resetData } from './seed-safety.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const makeProducts = () => ({
  name: faker.person.firstName(),
  description: faker.lorem.sentence({ min: 1, max: 3 }),
  price: faker.number.int({ min: 1000, max: 10000 }),
  tags: faker.helpers.arrayElements(
    ['javascript', 'webdev', 'html', 'css', 'nodejs'],
    { min: 1, max: 3 },
  ),
});

const makeArticles = () => ({
  title: faker.lorem.sentence({ min: 1, max: 3 }),
  content: faker.lorem.paragraph({ min: 3, max: 8 }),
});

const makeProductComments = (productId) => ({
  content: faker.lorem.sentence({ min: 1, max: 5 }),
  productId,
});

const makeArticleComments = (articleId) => ({
  content: faker.lorem.sentence({ min: 1, max: 5 }),
  articleId,
});

const NUM_TO_CREATE_PRODUCT = 4;
const NUM_TO_CREATE_ARTICLE = 5;

const seed = async (prisma) => {
  const productData = Array.from({ length: NUM_TO_CREATE_PRODUCT }, () =>
    makeProducts(),
  );
  const products = await prisma.product.createManyAndReturn({
    data: productData,
  });

  const articleData = Array.from({ length: NUM_TO_CREATE_ARTICLE }, () =>
    makeArticles(),
  );

  const articles = await prisma.article.createManyAndReturn({
    data: articleData,
  });

  const productCommentData = [];
  for (const product of products) {
    const count = faker.number.int({ min: 1, max: 6 });
    for (let i = 0; i < count; i++) {
      productCommentData.push(makeProductComments(product.id));
    }
  }

  await prisma.productComment.createMany({ data: productCommentData });

  const articleCommentData = [];
  for (const article of articles) {
    const count = faker.number.int({ min: 1, max: 6 });
    for (let i = 0; i < count; i++) {
      articleCommentData.push(makeArticleComments(article.id));
    }
  }

  await prisma.articleComment.createMany({ data: articleCommentData });
};

const main = async (prisma) => {
  assertSafeSeedTarget({
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    args: process.argv,
  });

  await resetData(prisma);
  await seed(prisma);
};

main(prisma)
  .catch((error) => {
    console.error('시딩 오류:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
