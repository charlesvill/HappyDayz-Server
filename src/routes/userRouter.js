const { Router } = require('express');
const passport = require('../authentication/passport-config');
const {
  createNewUser,
  updateUserController,
  // readUserData,
  deleteUser,
} = require('../controllers/userController');

const userRouter = Router();

userRouter.post('/', createNewUser);

userRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user);
    res
      .status(200)
      .json({ test: 'You are on protected route!', user: req.user });
  }
);

userRouter.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  updateUserController
);

userRouter.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);

userRouter.get('/test', (req, res) => {
  res.status(200).json({ test: 'success' });
});

module.exports = userRouter;
