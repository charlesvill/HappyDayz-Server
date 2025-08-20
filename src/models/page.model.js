const prisma = require('../../prisma/prisma');

async function getPageById(pageId) {
  return prisma.page.findUnique({
    where: {
      id: Number(pageId),
    },
  });
}

async function createPage(eventId, pageData) {
  return prisma.page.create({
    data: pageData,
  });
}

module.exports = { getPageById, createPage };
