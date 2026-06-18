require('dotenv').config({ override: false });
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');

async function seedDb() {
  console.log(`running in ${process.env.NODE_ENV} environment`);

  if (!process.env.PASSWORD) {
    throw new Error('PASSWORD env var missing');
  }

  const dataExists = await prisma.user.findUnique({
    where: { username: 'charlesvill' },
  });

  if (!dataExists) {
    const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);

    const user = await prisma.user.create({
      data: {
        username: 'charlesvill',
        first_name: 'Foo',
        last_name: 'Baz',
        hash: hashedPassword,
      },
    });

    const event = await prisma.event.create({
      data: {
        name: 'Wedding 2026',
        description: 'Celebrating Union',
        startDate: new Date('2026-06-26T17:00:00.000Z'),
        endDate: new Date('2026-06-27T00:00:00.000Z'),
        location: {
          city: 'Los Angeles',
          venue: 'El Monte',
        },
        host_id: user.id,
        pages: {
          create: [
            {
              title: 'Photo Album',
              type: 'info',
              slug: 'welcome',
              order: 1,
              modules: {
                create: [
                  {
                    type: 'text',
                    order: 1,
                    data: {
                      heading: 'Thank you for coming!',
                      body: 'Share your moments here!',
                    },
                  },
                  {
                    type: 'image',
                    order: 2,
                    data: {
                      url: 'https://example.com/banner.jpg',
                      alt: 'Banner',
                    },
                  },
                ],
              },
            },
          ],
        },
        guests: {
          create: [
            {
              first_name: 'Alice',
              last_name: 'Smith',
              email: 'alice@example.com',
            },
            {
              first_name: 'Bob',
              last_name: 'Johnson',
              email: 'bob@example.com',
            },
            {
              first_name: 'Charlie',
              last_name: 'Brown',
              email: 'charlie@example.com',
            },
          ],
        },
      },
    });

    console.log('Seeded:', { user, event });
  } else {
    console.log('Data already exists');
  }
}

seedDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
