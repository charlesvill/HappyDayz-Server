const authRouter = require('../routes/authRouter');
const prisma = require('../../prisma/prisma');

const request = require('supertest');
const express = require('express');

describe('auth works', function () {
  const app = express();
  const user = { username: 'fbaz123', password: '1234' };

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(err.statusCode || 500)
      .send(err.name + ' ' + err.statusCode + ': ' + err.message);
  });

  it('returns success response on sign in', async () => {
    return request(app)
      .post('/auth')
      .send(user)
      .set('accept', 'application/json')
      .expect(200)
      .then((response) => {
        expect(response.body.user.username).toEqual(user.username);
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

// integration test to pass credentials for logging in and get user data response
// auth user needs username & password
// returns 200 & json : message: 'Auth passed'
