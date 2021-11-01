'use strict';
// catRoute
const express = require('express');
const multer  = require('multer');
const upload = multer({dest: './uploads/'});
const router = express.Router();
const { cat_list_get, cat_get, cat_post} = require('../controllers/catController');

router.get('/', cat_list_get);

router.get('/:id', cat_get);

router.post('/', upload.single('cat'), cat_post);

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit cats.');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete cats.');
});

module.exports = router;
