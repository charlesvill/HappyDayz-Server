const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const prisma = require('../../prisma/prisma.js');
const { InternalServerError } = require('../utils/err.js');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: jwt_payload.sub,
      },
    });

    if (!user) {
      return done(new InternalServerError('Authorization failed!'), false);
    }

    console.log('we have  a successful jwt verification on a route!');
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});
