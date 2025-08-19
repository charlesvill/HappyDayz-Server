require('dotenv').config();
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
        username: 'fbaz123',
        first_name: 'Foo',
        last_name: 'Baz',
        hash: hashedPassword,
      },
    });

    const event = await prisma.event.create({
      data: {
        name: 'Tech Summit 2025',
        description:
          'Annual technology summit with talks, panels, and networking.',
        startDate: new Date('2025-09-15T09:00:00.000Z').toISOString(),
        endDate: new Date('2025-09-17T17:00:00.000Z').toISOString(),
        location: {
          city: 'San Francisco',
          venue: 'Moscone Center',
          room: 'Hall A',
        },
        host_id: user.id,
        pages: {
          create: [
            {
              title: 'Welcome',
              type: 'info',
              slug: 'welcome',
              order: 1,
              module: {
                create: [
                  {
                    type: 'text',
                    order: 1,
                    data: {
                      heading: 'Welcome to Tech Summit 2025',
                      body: 'We’re excited to have you here for three days of cutting-edge tech talks, panels, and networking.',
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
            {
              title: 'Schedule',
              type: 'agenda',
              slug: 'schedule',
              order: 2,
              module: {
                create: [
                  {
                    type: 'agenda',
                    order: 1,
                    data: {
                      day: 'Day 1',
                      sessions: [
                        {
                          time: '09:00',
                          title: 'Keynote: The Future of AI',
                          speaker: 'Dr. Ada Lovelace',
                        },
                        {
                          time: '11:00',
                          title: 'Panel: Cybersecurity in 2025',
                          speaker: 'Various',
                        },
                        {
                          time: '14:00',
                          title: 'Workshop: Building with WebAssembly',
                          speaker: 'Jane Developer',
                        },
                      ],
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
