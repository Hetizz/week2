'use strict';
// catRoute
const express = require('express');
const router = express.Router();
const {user_list_get, user_get, user_post} = require('../controllers/userController');

router.get('/', user_list_get);

router.get('/:id', user_get);

router.post('/', user_post);

module.exports = router;

