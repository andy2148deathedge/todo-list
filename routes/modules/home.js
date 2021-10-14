const express = require('express');
const router = express.Router();

// routing index '/'
const Todo = require('../../models/todo');

router.get('/', (req, res) => {
  Todo.find()
    .lean()
    .sort({ _id: 'asc'}) // asc <=> desc 
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error('error'))
});


module.exports = router; // export for index.js (總路由)