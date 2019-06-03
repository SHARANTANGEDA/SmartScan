const JWTStrategy = require('passport-jwt/lib').Strategy;
const extractJWT = require('passport-jwt/lib').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('./keys');

const opts = {};
opts.jwtFromRequest = extractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use('lvpei',
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if(user) {
            if(user.role==='lvpei') {
              return done(null,user);
            } else {
              return done(null,false);
            }          }
          return done(null,false);
        })
        .catch(err=>console.log(err));
    })
  );
  passport.use('all',
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if(user) {
            return done(null,user);
          }
          return done(null,false);
        })
        .catch(err=>console.log(err));
    })
  );
  passport.use('MRI',
    new JWTStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if(user) {
            if(user.role==='MRI') {
              return done(null,user);
            } else {
              return done(null,false);
            }          }
          return done(null,false);
        })
        .catch(err=>console.log(err));
    })
  );
};