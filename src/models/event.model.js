const prisma = require('../../prisma/prisma');
const { connect } = require('../routes/authRouter');

async function createEvent(
  userId,
  name,
  description,
  startDate,
  endDate,
  location
) {
  return prisma.event.create({
    data: {
      name,
      description,
      startDate,
      endDate,
      location,
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
  });
}

async function updateEventRow(
  eventId,
  name,
  description,
  startDate,
  endDate,
  location
) {
  return prisma.event.update({
    where: {
      id: Number(eventId),
    },
    data: {
      name,
      description,
      startDate,
      endDate,
      location,
    },
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
