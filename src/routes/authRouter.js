const { Router } = require('express');
const authRouter = Router();
const authenticateUser = require('../authentication/authentication');

authRouter.post('/', authenticateUser);

module.exports = authRouter;
