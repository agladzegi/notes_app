const express = require('express');

const controllers = require('./auth.controller');
const middlewares = require('../middlewares/middlewares');

const router = express.Router();

router.get('/', middlewares.isLoggedIn, controllers.getUser);
router.post('/register', controllers.register);
router.post('/login', controllers.login);

module.exports = router;
