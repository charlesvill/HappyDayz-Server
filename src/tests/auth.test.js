const authRouter = require('../routes/authRouter');
const userRouter = require('../routes/userRouter');
const prisma = require('../../prisma/prisma');
const { user, errorMiddleWare } = require('./test_utils/test_utils');

const request = require('supertest');
const express = require('express');

describe('auth works', function () {
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use(errorMiddleWare);

  it('signs in and has access to protected route', () => {
    return request(app)
      .post('/auth')
      .send(user)
      .set('accept', 'application/json')
      .expect(200)
      .then((response) => {
        return request(app)
          .get('/user')
          .set('Authorization', `Bearer ${response.body.token}`)
          .set('accept', 'application/json')
          .expect(200)
          .then((response) => {
            expect(response.body.test).toEqual('You are on protected route!');
            expect(response.body.user.username).toEqual('fbaz123');
          });
      });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});

// integration test to pass credentials for logging in and get user data response
// auth user needs username & password
// returns 200 & json : message: 'Auth passed'
