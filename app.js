// import npm(現成)套件
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // 若非產品模式，就會使用 .env 裡面的環境設定
}

// import 自製套件
const routes = require('./routes');
const usePassport = require('./config/passport')
require('./config/mongoose');

// 建立 Server 變數 app
const app = express();
const PORT = process.env.PORT;

// 各種設置 & middleware
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');  

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

usePassport(app);

app.use(flash());
app.use((req, res, next) => { // routing 之前先放 目的是取出 user 到 res
  // locals 是一個 express res 的物件, 可以把本來在 req 之下的物件屬性/方法給定位在 res.locals 內
  // ※ 另外，express 讓 res.locals 內的資料都能直接被 views 存取，不用特地傳給某個頁面，太讚啦！
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  next(); // 進 routing
});

// routing
app.use(routes);

// server listen
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})