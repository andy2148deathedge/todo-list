const express = require('express');
const router = express.Router();

/* routing area */
const Todo = require('../../models/todo');

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const name = req.body.name;
  const todo = new Todo({name}); // name: name 

  return todo.save() // 這行也可以寫 retuen create({ name }), 並且上面就不用創建新的 Todo 實例 
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
})

router.get('/:id', (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then(todo => res.render('detail', { todo })) 
    .catch(error => console.log(error));
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id;

  return Todo.findById(id)
    .lean()
    .then(todo => {
      res.render('edit', { todo })
    }) 
    .catch(error => console.log(error));
})

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .then(todo => todo.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error));
})
/* routing area */ 


module.exports = router;