// import npm(現成)套件
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// import 自製套件
const routes = require('./routes');
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

// routing
app.use(routes);

// server listen
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
})