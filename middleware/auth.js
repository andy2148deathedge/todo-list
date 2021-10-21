module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // next() 使得有成功認證的請求會接著往下一個路由
    }
    req.flash('warning_msg', '請先登入!');
    res.redirect('/users/login'); 
  }
}