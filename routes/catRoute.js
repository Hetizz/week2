'use strict';
// catRoute
const express = require('express');
const multer  = require('multer');
const fileFilter = (req, file, cb) => {
  if(file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();
const {body} = require('express-validator');
const { cat_list_get, cat_get, cat_post, cat_put, cat_delete} = require('../controllers/catController');

router.get('/', cat_list_get);

router.get('/:id', cat_get);

router.post('/', upload.single('cat'),
    body('name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    body('owner').isNumeric(),
    cat_post);

router.put('/',
    body('name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    body('owner').isNumeric(),
    cat_put);

router.delete('/:id', cat_delete);

router.put('/', (req, res) => {
  res.send('With this endpoint you can edit cats.');
});

router.delete('/', (req, res) => {
  res.send('With this endpoint you can delete cats.');
});

module.exports = router;
