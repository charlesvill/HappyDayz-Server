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

async function readEventById(userId, eventId) {
  return prisma.event.findUnique({
    where: {
      id: Number(eventId),
      host_id: Number(userId),
    },
  });
}

async function updateEventRow(
  userId,
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
      host_id: Number(userId),
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
module.exports = { createEvent, readEventById, updateEventRow };
