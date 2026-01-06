const prisma = require('../../prisma/prisma');
const { connect } = require('../routes/authRouter');

async function createEvent(userId, eventData) {
  return prisma.event.create({
    data: {
      ...eventData,
      host: {
        connect: {
          id: Number(userId),
        },
      },
    },
  });
}

async function readEventById(eventId) {
  return prisma.event.findUnique({
    where: {
      id: Number(eventId),
    },
    include: {
      pages: {
        include: {
          modules: true,
        },
      },
    },
  });
}

async function updateEventRow(eventId, eventData) {
  return prisma.event.update({
    where: {
      id: Number(eventId),
    },
    data: eventData,
  });
}

async function deleteEventById(eventId) {
  return prisma.event.delete({
    where: {
      id: Number(eventId),
    },
  });
}

module.exports = {
  createEvent,
  readEventById,
  updateEventRow,
  deleteEventById,
};
