'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {httpError} = require('../utils/errors')

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
      const token = jwt.sign(user, 'fgjdhjfjhgbb');
      return res.json({user, token});
    });
  })(req, res, next);
};

module.exports = {
  login,
};