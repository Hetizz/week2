'use strict';
// catRoute
const express = require('express');
const {body} = require('express-validator')
const router = express.Router();
const {user_list_get, user_get, user_post} = require('../controllers/userController');

router.get('/', user_list_get);

router.get('/:id', user_get);

router.post('/',
    body('name').isLength({min: 3}),
    body('email').isEmail(),
    body('passwd').matches('(?=.*[A-Z]).{8,}'),
    user_post);

module.exports = router;

