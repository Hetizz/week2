'use strict';
// catController
const userModel = require('../models/userModel');

const {users, getUser} = userModel;

const user_list_get = (req, res) => {
  //remove password
  const newusers = users.map((user) =>{
    delete user.password;
    return user;
  });
  res.json(newusers);
};

const user_get = (req, res) => {
  const vastaus = getUser(req.params.id);
  delete vastaus.password;
  res.json(vastaus);
};

const user_post = (req, res) => {
  console.log(req.body);
  res.send('With this endpoint you can add users.');
};

module.exports = {
  user_list_get,
  user_get,
  user_post,
}