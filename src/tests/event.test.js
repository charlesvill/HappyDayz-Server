const eventRouter = require('../routes/eventRouter');
const authRouter = require('../routes/authRouter');
const prisma = require('../../prisma/prisma');
const { user, errorMiddleWare } = require('./test_utils/test_utils');
const { dummyRequest } = require('./dummyRequest');

const request = require('supertest');
const express = require('express');

describe('event router and controllers work', function() {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/event', eventRouter);
  app.use(errorMiddleWare);

  let token;
  let userId;
  let eventId;

  it('creates an event', () => {
    return request(app)
      .post('/auth')
      .send(user)
      .expect(200)
      .then((response) => {
        token = response.body.token;
        userId = response.body.user.id;
        return request(app)
          .post(`/event/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(dummyRequest)
          .expect(200)
          .then((response) => {
            eventId = response.body.id;
            console.log('event id:', eventId);
            console.log('response body: ', response.body);
            expect(response.body.name).toEqual('birthday');
          });
      });
  });

  // reading an event depends on the success of the previous test
  // eventId assigned if and only if 200 on above query
  it('reads an events properties', () => {
    return request(app)
      .get(`/event/${userId}/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then((response) => {
        expect(response.body.name).toEqual('birthday');
        expect(Array.isArray(response.body.pages)).toBe(true);
        expect(response.body.pages.length).toBe(dummyRequest.pages.length);
        expect(Array.isArray(response.body.pages[0].modules)).toBe(true);
        expect(response.body.pages[0].modules.length).toBe(
          dummyRequest.pages[0].modules.length
        );
      });
  });

  it('updates an event', () => {
    return request(app)
      .put(`/event/${userId}/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'it is not your birthday' })
      .expect(200)
      .then((response) => {
        expect(response.body.description).toEqual('it is not your birthday');
      });
  });

  // delete test

  // ** reminder that the console is supposed to throw 404 error **
  it('deletes an event', () => {
    console.log('event id for delete: ', eventId);
    return request(app)
      .delete(`/event/${userId}/${eventId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(() => {
        return request(app)
          .get(`/event/${userId}/${eventId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(404);
      });
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
});
