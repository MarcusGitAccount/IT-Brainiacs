'use strict';

const router = require('express').Router();
const parser = require('body-parser');

const HomeController = require('../controllers/HomeController');

const entries = new HomeController();

module.exports = (function route() {
  router.use(parser.urlencoded({ 'extended': true}));
  router.use(parser.json());
  
  router.get('/', entries.index);

  
  return router;
});