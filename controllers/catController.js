'use strict';
// catController
const catModel = require('../models/catModel');

//const cats = catModel.cats;
const {cats, getCat,} = catModel;

const cat_list_get = (req, res) => {
  res.json(cats);
};

const cat_get = (req, res) => {
  //lähetä yksi kissa
  const vastaus = getCat(req.params.id);
  res.json(vastaus);
};

const cat_post = (req, res) => {
  console.log(req.body, res.file);
  res.send('With this endpoint you can add cats.');
};

module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
};
