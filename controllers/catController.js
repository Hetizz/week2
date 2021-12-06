'use strict';
// catController
const {validationResult} = require('express-validator');
const catModel = require('../models/catModel');
const {httpError} = require('../utils/errors');
const { getCoordinates } = require('../utils/imageMeta');
const {makeThumbnail} = require('../utils/resize')

//const cats = catModel.cats;
const {getAllCats, getCat, addCat, modifyCat, deleteCat} = catModel;

const cat_list_get = async (req, res, next) => {
  try {
    const cats = await getAllCats(next);
    if (cats.length > 0) {
      res.json(cats);
    } else {
      next('NO CATS', 404);
    }
  } catch (e) {
   console.log('cat_list_get error', e.message);
   next(httpError('internal server error'), 500);
  }
};

const cat_get = async (req, res, next) => {
  //lähetä yksi kissa
  try {
    const vastaus = await getCat(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('ei löydy kissaa :(', 404));
    }
  } catch (e) {
    console.log('cat_get error', e.message);
    next(httpError('internal server error'), 500);
  }
};

const cat_post = async (req, res, next) => {
  console.log('cat_post', req.body, req.file, req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_post validatifg: ', errors.array())
    next(httpError('invalid data', 400));
    return;
  }
  if (!req.file) {
    const err = httpError('file ei ok', 400)
    next(err);
    return;
  }

  try {
    const coords = await getCoordinates(req.file.path);
    req.body.coords = coords;
  } catch (e) {
    req.body.coords = [24.74, 60.24];
  }

  try {
    const thumb = makeThumbnail(
        req.file.path,
        './thumbnails/' + req.file.filename
    );

    const { name, weight, birthdate, coords } = req.body;
    const tulos = await addCat(
        name,
        weight,
        req.user.user_id,
        req.file.filename,
        birthdate,
        JSON.stringify(coords),
        next
    );
    if (thumb) {
      if (tulos.affectedRows > 0) {
        res.json({
          message: 'cat added',
          cat_id: tulos.insertId,
        });
      } else {
        next(httpError('NO CAT ADDED', 400));
      }
    }
  } catch (e) {
    console.log('user_post error', e.message);
    next(httpError('internal server error', 500));
  }

};

const cat_put = async (req, res, next) => {
  console.log('cat_put', req.body, req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('cat_put validation', errors.array());
    next(httpError('invalid data', 400));
    return;
  }
  try {
    const { name, birthdate, weight } = req.body;
    /*let owner = req.user.user_id;
    if (req.user.role === 0) {
      owner = req.body.owner;
    }*/

    const owner = req.user.role === 0 ? req.body.owner : req.user.user_id;

    const tulos = await modifyCat(name, weight, owner, birthdate, req.params.id, req.user.role, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'cat modified',
        cat_id: tulos.insertId,
      });
    } else {
      next(httpError('No cat modified', 400));
    }
  } catch (e) {
    console.log('cat_put error', e.message);
    next(httpError('internal server error', 500));
  }
};

const cat_delete = async (req, res, next) => {
  try {
    const vastaus = await deleteCat(req.params.id, req.user.user_id, req.user.role, next);
    if (vastaus.affectedRows > 0) {
      res.json({
        message: 'cat deleted',
        cat_id: vastaus.insertId,
      });
    } else {
      next(httpError('No cat found', 404));
    }
  } catch (e) {
    console.log('cat_delete error', e.message);
    next(httpError('internal server error', 500));
  }
};


module.exports = {
  cat_list_get,
  cat_get,
  cat_post,
  cat_put,
  cat_delete,
};
