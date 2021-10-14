const express = require('express');
const router = express.Router();


/* routing 邏輯 modules 設置區 */

const home = require('./modules/home'); // import home logic mod
router.use('/', home); // all '/' requests use home mod logic

const todos = require('./modules/todos');
router.use('/todos', todos);

/* routing 邏輯 modules 設置區 */ 



module.exports = router; // export to module wrapper for app.js 