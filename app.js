const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongodb error');
})

db.once('open', () => { 
  console.log('mongodb connected');
})


app.get('/', (req, res) => {
  res.send('Here is index of todo project')
})

app.listen(3000, () => {
  console.log('Sever is listening in port 3000.');
})