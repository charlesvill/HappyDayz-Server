const prisma = require('../../prisma/prisma');

async function getPageById(pageId) {
  return prisma.page.findUnique({
    where: {
      id: Number(pageId),
    },
  });
}

async function createPage(eventId, pageData) {
  // instantiate a cmpu
  // locate modules
  return prisma.page.create({
    data: {
      ...pageData,
      event: {
        connect: {
          id: Number(eventId),
        },
      },
    },
  });
}

module.exports = { getPageById, createPage };
