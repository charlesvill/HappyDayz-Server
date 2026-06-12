require('dotenv').config({ override: false });
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');

async function seedDb() {
  console.log(`running in the ${process.env.NODE_ENV} environment`);

  const dataExists = await prisma.user.findUnique({
    where: {
      username: 'fbaz123',
    },
  });
  if (!dataExists || dataExists.length < 1) {
    const hashedPassword = await bcrypt.hash('1234', 10);
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
        description: 'Celbrating Union',
        startDate: new Date('2026-06-26T17:00:00.000Z').toISOString(),
        endDate: new Date('2025-06-27T00:00:00.000Z').toISOString(),
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
                      heading: 'Thank you for coming to our celebration!',
                      body: 'Share all your captured moments with us here!',
                    },
                  },
                  {
                    type: 'image',
                    order: 2,
                    data: {
                      url: 'https://example.com/banner.jpg',
                      alt: 'Tech Summit Banner',
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
              phone_number: '555-123-4567',
              email: 'alice@example.com',
            },
            {
              first_name: 'Bob',
              last_name: 'Johnson',
              phone_number: '555-987-6543',
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

    console.log('Seeded data:', { user, event });
  } else {
    console.log('data should already exist!');
  }
}

seedDb()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
