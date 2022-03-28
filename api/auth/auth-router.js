const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware.js);

const {
  add,
  findBy
} = require('../../users/users-model.js');

const router = require('express').Router();
const bcrypt = requite('bcryptjs');

