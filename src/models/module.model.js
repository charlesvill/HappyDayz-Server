const primsa = require('../../prisma/prisma');
const { connect } = require('../routes/pageRouter');
const { getPageById } = require('./page.model');

async function getModuleById(moduleId) {
  return prisma.module.findUnique({
    where: {
      id: Number(moduleId),
    },
  });
}

async function createModule(pageId, moduleData) {
  return prisma.module.create({
    data: {
      ...moduleData,
      page: {
        connect: {
          id: Number(pageId),
        },
      },
    },
  });
}

module.exports = { getModuleById, createModule };
