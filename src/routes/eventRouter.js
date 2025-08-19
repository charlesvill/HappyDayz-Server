const { Router } = require('express');
const passport = require('../authentication/passport-config');
const { addEvent, getEventById } = require('../controllers/eventController');

const eventRouter = Router();

eventRouter.post(
  '/:userid',
  passport.authenticate('jwt', { session: false }),
  addEvent
);

//expects ?userid=#
eventRouter.get(
  '/:eventid',
  passport.authenticate('jwt', { session: false }),
  getEventById
);

module.exports = eventRouter;

// create, read, update and delete events

// need to create some middleware that checks that particular resource pertains to token being passed.
// need to review what information is contained in the token and how we can match a user id with content id
// we have access to the req.user object which has all the columns available in the user table for that user
