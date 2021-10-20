const express = require('express');
const router = express.Router();

const User = require('../../models/user');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  // ...
});

router.get('/register', (req, res) => {
  res.render('register');
});

// router.post('/register', (req, res) => {
//   const {name, email, password, passwordConfirm} = req.
// });

module.exports = router;