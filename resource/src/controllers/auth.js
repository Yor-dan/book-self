/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
require('dotenv').config();
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  if (!req.cookies.session) return res.render('landing', { title: 'Home' });
  return res.status(200).redirect('/books');
};

const getUser = (req, res, next) => {
  if (!req.cookies.session) return res.status(401).redirect('/');
  req.user = jwt.verify(req.cookies.session, process.env.TOKEN_SECRET);
  return next();
};

const logout = async (req, res) => {
  res.status(200).clearCookie('session').redirect('/');
};

module.exports = {
  login,
  getUser,
  logout,
};
