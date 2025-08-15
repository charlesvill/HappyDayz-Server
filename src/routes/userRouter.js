const { Router } = require('express');
const passport = require('../authentication/passport-config');
const {
  createNewUser,
  updateUser,
  // readUserData,
  deleteUser,
} = require('../controllers/userController');

const userRouter = Router();

userRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user);
    res.json(req.user);
  }
);

userRouter.post('/', createNewUser);

userRouter.put('/', updateUser);

userRouter.delete('/', deleteUser);

module.exports = userRouter;
