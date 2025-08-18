const userRouter = require('../routes/userRouter');

const request = require('supertest');
const express = require('express');

describe('user router works', (done) => {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use('/user', userRouter);

  it('200 response on GET', async function () {
    request(app)
      .get('/user/test')
      .expect('Content-Type', /json/)
      .expect({ test: 'success' })
      .expect(200, done);
  });
});
