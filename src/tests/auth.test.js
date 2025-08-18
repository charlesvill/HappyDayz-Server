const authRouter = require('../routes/authRouter');

const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/auth', authRouter);

// integration test to pass credentials for logging in and get user data response
