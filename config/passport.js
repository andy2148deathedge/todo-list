const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy
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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      const {name, email} = profile._json;
      User.findOne({ email })
        .then(user => {
          if(user) return done(null, user); // 已有該使用者 email 就直接丟 user

          const randomPassword = Math.random().toString(36).slice(-8);
          bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(randomPassword, salt))
            .then(hash => User.create({ // DB沒有該使用者 email 情況就建一筆 document
              name, 
              email, 
              password: hash
            }))
            .then(user => done(null, user))
            .catch(err => done(err, false));
        })
    }      
));

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