const prisma = require('../../prisma/prisma');

async function eventService(userId, body) {
  const { hostName, pages, ...fields } = body;
  const result = await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
      data: {
        ...fields,
        host: {
          connect: {
            id: Number(userId),
          },
        },
      },
    });
    // check if there are pages in event.pages
    if (!pages?.length) {
      return event;
    }

    for (const page of pages) {
      const { modules, ...pageData } = page;
      const newPage = await tx.page.create({
        data: {
          ...pageData,
          event: {
            connect: {
              id: Number(event.id),
            },
          },
        },
      });

      //** need to check module column names, front end json object passed has html
      //field
      //

      if (modules?.length) {
        await tx.module.createMany({
          data: modules.map((m) => ({
            ...m,

            page_id: Number(newPage.id),
          })),
        });
      }
    }
    return event;
  });
  // starts the prisma transaction with cb fn
  // create event, get id
  // if req.body has pages,
  return result;
}

module.exports = eventService;
