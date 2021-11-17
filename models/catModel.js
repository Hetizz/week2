'use strict';
const pool = require('../database/db');
const {httpError} = require('../utils/errors')
const promisePool = pool.promise();

const getAllCats = async (next) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner's name as ownername (from wop_user table).
    const [rows] = await promisePool.execute('SELECT cat_id, wop_cat.name, weight, wop_cat.owner, filename, birthdate, wop_user.name as ownername FROM wop_cat\n' +
        '    JOIN wop_user ON wop_cat.owner = wop_user.user_id');
    //console.log('haun tulos', rows);
    return rows;
  } catch (e) {
    console.error('getAllCats error', e.message);
    next(httpError('Database error'));
  }
};

const getCat = async (id, next) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT cat_id, wop_cat.name, weight, wop_cat.owner, filename, birthdate, wop_user.name as ownername FROM wop_cat\n' +
        '    JOIN wop_user ON wop_cat.owner = wop_user.user_id WHERE cat_id = ?', [id]
    );
    console.log('haun tulos', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    next(httpError('ERROR'));
  }
};

const addCat = async (name, weight, owner, filename, birthdate, next) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_cat (name, weight, owner, filename, birthdate) VALUES (?, ?, ?, ?, ?)',
        [name, weight, owner, filename, birthdate]
    );
    return rows;
  } catch (e) {
    console.error('addcat error', e.message);
    next(httpError('addcatERROR', 500));
  }
};

const modifyCat = async (name, weight, owner, birthdate, cat_id, role, next) => {
  let sql = 'UPDATE wop_cat SET name = ?, weight = ?, birthdate = ? WHERE cat_id = ? AND owner = ?;';
  let params = [name, weight, birthdate, cat_id, owner];
  if (role === 0) {
    sql =
        'UPDATE wop_cat SET name = ?, weight = ?, birthdate = ?, owner = ? WHERE cat_id = ?;';
    params = [name, weight, birthdate, owner, cat_id];
  }
  try {
    const [rows] = await promisePool.execute(
        sql, params
    );
    return rows;
  } catch (e) {
    console.error('addCat error', e.message);
    next(httpError('Database error', 500));
  }
};

const deleteCat = async (id, owner_id, role, next) => {
  let sql = 'DELETE FROM wop_cat WHERE cat_id = ? AND owner = ?';
  let params = [id, owner_id];
  if (role === 0) {
    sql = 'DELETE FROM wop_cat WHERE cat_id = ?';
    params = [id];
  }
  try {
    const [rows] = await promisePool.execute(
        sql, params
    );
    return rows;
  } catch (e) {
    console.error('deleteerror', e.message);
    next(httpError('ERROR', 500));
  }
};


module.exports = {
  getAllCats,
  getCat,
  addCat,
  modifyCat,
  deleteCat,
};
