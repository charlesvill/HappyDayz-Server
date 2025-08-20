const { Router } = require('express');
const { getPage, addPage } = require('../controllers/pageController');
const passport = require('passport');

const pageRouter = Router();

pageRouter.get(
  '/:userid/:eventid/:pageid',
  passport.authenticate('jwt', { session: false }),
  getPage
);

pageRouter.get(
  '/:userid/:eventid',
  passport.authenticate('jwt', { session: false })
);

pageRouter.post(
  '/:userid/:eventid',
  passport.authenticate('jwt', { session: false }),
  addPage
);

module.exports = pageRouter;
