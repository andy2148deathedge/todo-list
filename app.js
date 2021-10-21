// import npm(現成)套件
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// import 自製套件
const routes = require('./routes');
const usePassport = require('./config/passport')
require('./config/mongoose');

// 建立 Server 變數 app
const app = express();
const PORT = process.env.PORT || 3000;

// 各種設置 & middleware
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');  

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

usePassport(app);

app.use((req, res, next) => {
  // locals 是一個 node res 的物件, 可以把本來在 req 之下的物件屬性/方法給定位在 res.locals 內
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});


// routing
app.use(routes);

// server listen
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})