const prisma = require('../../prisma/prisma');

async function getModuleById(moduleId) {
  return prisma.module.findUnique({
    where: {
      id: Number(moduleId),
    },
  });
}

async function getModulesByPageId(pageId) {
  return prisma.page.findUnique({
    where: {
      id: Number(pageId),
    },
    include: {
      modules: true,
    },
  });
}

async function createModule(pageId, moduleData) {
  console.log(pageId, moduleData);
  const moduleCount = await prisma.module.count({
    where: {
      page_id: Number(pageId),
    },
  });

  return prisma.module.create({
    data: {
      type: moduleData.type,
      order: moduleData.order ?? moduleCount + 1,
      data: moduleData.data ?? moduleData,
      page: {
        connect: {
          id: Number(pageId),
        },
      },
    },
  });
}

async function deleteModule(moduleId, pageId) {
  return prisma.module.delete({
    where: {
      id: Number(moduleId),
      page_id: Number(pageId),
    },
  });
}

module.exports = {
  getModuleById,
  getModulesByPageId,
  createModule,
  deleteModule,
};
