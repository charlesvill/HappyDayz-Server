const userRouter = require('../routes/userRouter');

const request = require('supertest');
const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);

test('user router works', (done) => {
  request(app)
    .get('/user/test')
    .expect('Content-Type', /json/)
    .expect({ test: 'success' })
    .expect(200, done);
});
