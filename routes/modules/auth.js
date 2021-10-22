const express = require('express');
const router = express.Router();

const passport = require('passport');

// 使用者按鈕進行臉書驗證
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email','public_profile']
}));

// facebool callback 的路由
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: "/",
  failureRedirect: "/users/login",
}));

module.exports = router;