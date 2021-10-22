const express = require('express');
const router = express.Router();

/* routing 邏輯 modules 設置區 */
const home = require('./modules/home'); // import home logic mod
const todos = require('./modules/todos');
const users = require('./modules/users');
const auth = require('./modules/auth');

const { authenticator } = require('../middleware/auth');

// 條件越嚴謹的越往上放
router.use('/todos', authenticator, todos);
router.use('/users', users);
router.use('/auth', auth);
router.use('/', authenticator, home); // all '/' requests use home mod logic
/* routing 邏輯 modules 設置區 */ 

module.exports = router; // export to module wrapper for app.js 