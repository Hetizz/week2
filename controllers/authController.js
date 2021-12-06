'use strict';
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {addUser} = require('../models/userModel')
const {httpError} = require('../utils/errors')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(12);

const login = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err,  user, info)=>{
    console.log('login inffo', err, user, info);
    if (err || !user) {
      next(httpError(info.message, 400));
      return;
    }
    req.login(user, {session: false}, (err)=>{
      if (err) {
        next(httpError('login errror', 400));
        return;
      }
      delete user.password;
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({user, token});
    });
  })(req, res, next);
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
    //hash passw
    const hash = bcrypt.hashSync(passwd, salt);
    const tulos = await addUser(name, email, hash, next);
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
  login,
  user_post,
};