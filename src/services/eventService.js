// import prisma
const prisma = require('../../prisma/prisma');
const { connect } = require('../routes/authRouter');

//
async function eventService(userId, body) {
  // takes the data set
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        ...body.event,
        host: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });
    // check if there are pages in event.pages
    // return event object otherwise
    if (!event?.pages.length) {
      return event;
    }

    for (const page of event.pages) {
      const newPage = tx.page.create({
        data: {
          ...page,
          event: {
            connect: {
              id: Number(event.id),
            },
          },
        },
      });

      if (page?.modules.length) {
        tx.module.createMany({
          data: page.modules.map((m) => ({
            ...m,
            page: {
              connect: {
                id: Number(page.id),
              },
            },
          })),
        });
      }
    }
  });
  // starts the prisma transaction with cb fn
  // create event, get id
  // if req.body has pages,
  return result;
}

module.exports = eventService;
