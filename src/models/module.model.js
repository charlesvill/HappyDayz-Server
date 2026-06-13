const prisma = require('../../prisma/prisma');

async function getModuleById(moduleId) {
  return prisma.module.findUnique({
    where: {
      id: Number(moduleId),
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

module.exports = { getModuleById, createModule };
