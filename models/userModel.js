'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();
const {httpError} = require('../utils/errors')


const getAllUsers = async (next) => {
  try {
    const [userList] = await promisePool.execute('SELECT user_id, name, email, role FROM wop_user');
    return userList;
  } catch (e) {
    console.error('getallusers error', e.message);
    next(httpError('user ERROR', 500));
  }
};

const getUser = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT user_id, name, email, role FROM wop_user WHERE user_id = ?', [id]
    );
    //console.log('haun tulos', rows);
    return rows;
  } catch (e) {
    console.error('get user error', e.message);
    next(httpError('database error', 500));
  }
};

const addUser = async (name, email, password, next) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_user (name, email, password) VALUES (?, ?, ?)', [name, email, password]
    );
    return rows;
  } catch (e) {
    console.error('adduser error', e.message);
    next(httpError('adduserERROR', 500));
  }
};

const getUserLogin = async (params) => {
  try {
    console.log(params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_user WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('getuserlogin error', e.message);
    next(httpError('database ERROR', 500));
  }
};


module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin
};
