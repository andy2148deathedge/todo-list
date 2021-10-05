const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Here is index of todo project');
})

app.listen(3000, () => {
  console.log('Sever is listening in port 3000.');
})