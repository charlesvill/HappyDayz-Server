const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const dbURL =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbURL,
    },
  },
});

module.exports = prisma;
