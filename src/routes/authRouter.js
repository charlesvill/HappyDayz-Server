const { Router } = require('express');
const authRouter = Router();
const authenticateUser = require('../authentication/authentication');

authRouter.post('/', authenticateUser);

authRouter.get('/', (req, res) => {
  res.status(200).json({ test: 'you are in the auth router!' });
});

module.exports = authRouter;
