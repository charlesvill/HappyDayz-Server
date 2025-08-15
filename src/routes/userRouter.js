const { Router } = require('express');
const passport = require('../authentication/passport-config');
const {
  createNewUser,
  updateUser,
  // readUserData,
  deleteUser,
} = require('../controllers/userController');

const userRouter = Router();

userRouter.put('/', createNewUser);

userRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user);
    res.json(req.user);
  }
);

userRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  createNewUser
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
