const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const Todo = require('./models/todo');

const app = express();

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs');

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongodb error');
})

db.once('open', () => { 
  console.log('mongodb connected');
})

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  Todo.find()
    .lean()
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error('error'))
}) 

app.get('/todos/new', (req, res) => {
  return res.render('new')
})

app.post('/todos', (req, res) => {
  const name = req.body.name;
  const todo = new Todo({name}); // name: name 

  return todo.save() // 這行也可以寫 retuen create({ name }), 並且上面就不用創建新的 Todo 實例 
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
})

app.listen(3000, () => {
  console.log('Sever is listening in port 3000.');
})