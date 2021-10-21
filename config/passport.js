const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");

const User = require('../models/user');

module.exports = app => {
  // passport initialize
  app.use(passport.initialize());
  app.use(passport.session());

  // 設定 Strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Email not registered.' });
        }
        
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: 'Email or password incorrect.' });
          }
          return done(null, user)
        });
      })
      .catch(err => done(err, false));
  }));

  // 設定序列化&反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null));
  });
};