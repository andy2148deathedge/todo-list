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
    .sort({ _id: 'asc'}) // asc <=> desc 
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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo })) 
    .catch(error => console.log(error));
})

app.get('/todos/:id/edit', (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then(todo => {
      res.render('edit', { todo })
    }) 
    .catch(error => console.log(error));
})

app.post('/todos/:id/edit', (req, res) => {
  const id = req.params.id;
  const { name, isDone } = req.body; // Destructing req object

  return Todo.findById(id)
    .then(todo => {
      todo.name = name; // 解構出來的變數 name 賦值給資料庫物件
      todo.isDone = isDone === 'on'; // 原理同上，之前沒有的物件屬性 isDone MongoDB 會生成; 後面是跟 chk box 屬性有關的判斷式
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error));
    
})

app.post('/todos/:id/delete', (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
})

app.listen(3000, () => {
  console.log('Sever is listening in port 3000.');
})