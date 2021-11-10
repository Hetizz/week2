'use strict';
// catController
const {validationResult} = require('express-validator');
const {getAllUsers, getUser, addUser} = require('../models/userModel');
const {httpError} = require('../utils/errors');

const user_list_get = async (req, res, next) => {
  try {
    const rows = await getAllUsers(next);
    if (rows.length > 0) {
      res.json(rows);
    } else {
      next('NO USERS FOUND', 404);
    }
  } catch (e) {
    console.log('user_list_get error', e.message);
    next(httpError('internal sererrtg errer', 500));
  }
};

const user_get = async (req, res, next) => {
  try {
    const vastaus = await getUser(req.params.id, next);
    if (vastaus.length > 0) {
      res.json(vastaus.pop());
    } else {
      next(httpError('ei löydy ukkelii :(', 404));
    }
  } catch (e) {
    console.log('user_get error', e.message);
    next(httpError('internal sererrtg eroor',500));
  }

};

const user_post = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('user_post validatifg: ', errors.array())
    next(httpError('invalid data', 400));
    return;
  }

  try {
    console.log('lomakkeesta', req.body);
    const {name, email, passwd} = req.body;
    const tulos = await addUser(name, email, passwd, next);
    if (tulos.affectedRows > 0) {
      res.json({
        message: 'user added',
        user_id: tulos.insertId,
      });
    } else {
      next(httpError('NO USER', 400))
    }
    res.send('With this endpoint you can add users.');
  } catch (e) {
    console.log('user_post error', e.message);
    next(httpError('internal sererrtg eroor',500));
  }
};

module.exports = {
  user_list_get,
  user_get,
  user_post,
}