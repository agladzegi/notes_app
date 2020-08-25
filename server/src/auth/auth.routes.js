const express = require('express');

const controllers = require('./auth.controller');

const router = express.Router();

router.post('/register', controllers.register);
router.post('/login', controllers.login);

module.exports = router;
