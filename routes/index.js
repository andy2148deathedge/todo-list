const express = require('express');
const router = express.Router();

/* routing 邏輯 modules 設置區 */
const home = require('./modules/home'); // import home logic mod
const todos = require('./modules/todos');
const users = require('./modules/users');

router.use('/', home); // all '/' requests use home mod logic
router.use('/todos', todos);
router.use('/users', users);
/* routing 邏輯 modules 設置區 */ 

module.exports = router; // export to module wrapper for app.js 