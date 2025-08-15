const prisma = require('../../prisma/prisma');

async function createUser(userData) {
  return prisma.user.create({ data: userData });
}

async function updateUser(id, userData) {
  return prisma.user.update({
    where: {
      id: Number(id),
    },
    data: userData,
  });
}

async function getUserData(id) {
  return prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });
}

async function deleteUserEntry(id) {
  return prisma.user.delete({
    where: {
      id: Number(id),
    },
  });
}
module.exports = { createUser, updateUser, getUserData, deleteUserEntry };
