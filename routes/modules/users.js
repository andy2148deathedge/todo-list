const express = require('express');
const router = express.Router();

const passport = require('passport');
const User = require('../../models/user');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', { // 登入功能，使用 passport 的 authenticate()
  successRedirect: '/',
  failureRedirect: '/users/login'
}));

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const {name, email, password, confirmPassword} = req.body;
  
  User.findOne({ email })
    .then(user => {
      if(user) {
        res.render('register', {name, email, password, confirmPassword}); // 將該(user) 丟回 register 頁
      } else {
        return User.create({
          name,
          email,
          password
        })
          .then(() => res.redirect('/'))
          .catch(err => console.log(err));
      }
    });
});

router.get('/logout', (req, res) => { // 登出
  req.logout();
  res.redirect('/users/login');
});

module.exports = router;