const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    // 登入功能，使用 passport 的 authenticate()
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位都需填寫。" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與密碼確認欄位需一致。" });
  }
  if (errors.length) {
    return res.render("register", { errors, name, email, password, confirmPassword });
  }

  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "此信箱已被註冊。" });
      return res.render("register", { errors, name, email, password, confirmPassword }); // 將該(user) 丟回 register 頁
    }

    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash,
      }))
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

router.get("/logout", (req, res) => {
  // 登出
  req.logout();
  req.flash("success_msg", "已登出成功!");
  res.redirect("/users/login");
});

module.exports = router;
