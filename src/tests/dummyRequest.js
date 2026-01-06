const dummyRequest = {
  name: 'birthday',
  description: 'its your birthday.',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  location: '321 N Maynor Pl',
  image: 'https://images.squarespace-cdn.com',
  hostName: 'FooBar',
  pages: [
    {
      title: 'Home',
      type: 'home',
      slug: 'home',
      order: 0,
      modules: [
        {
          type: 'heading',
          order: 0,
          data: {
            size: 2,
            text: 'Address',
          },
        },
        {
          type: 'img',
          order: 1,
          data: {
            src: 'fake.source',
            alt: 'fake alt',
          },
        },
        {
          type: 'paragraph',
          order: 2,
          data: {
            text: '127 Washington Blvd',
          },
        },
      ],
    },
    {
      title: 'Location',
      type: 'location',
      slug: 'location',
      order: 1,
      modules: [
        {
          type: 'heading',
          order: 0,
          data: {
            size: 2,
            text: 'Address',
          },
        },
        {
          type: 'img',
          order: 1,
          data: {
            src: 'fake.source',
            alt: 'fake alt',
          },
        },
        {
          type: 'paragraph',
          order: 2,
          data: {
            text: '127 Washington Blvd',
          },
        },
      ],
    },
  ],
};

module.exports = { dummyRequest };
