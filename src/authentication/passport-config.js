const passport = require('passport');
const jwtStrategy = require('./jwt-strategy.js');

passport.use(jwtStrategy);

module.exports = passport;
