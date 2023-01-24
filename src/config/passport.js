const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const User = require('../db/models').User;

module.exports = function (passport) {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('JWT'),
    secretOrKey: process.env.JWT_SECRET,
  };
  
  passport.use(
    'jwt',
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ 
        where: { id: jwt_payload.id }, 
        include: "roles"
      })
        .then((user) => {
          return done(null, user);
        })
        .catch((error) => {
          return done(error, false);
        });
    })
  );
};
