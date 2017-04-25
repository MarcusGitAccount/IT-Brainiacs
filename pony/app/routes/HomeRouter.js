'use strict';

//const router = require('../../system/helpers/BaseRouter').controllerRouter;
const router = require('express').Router();
const parser = require('body-parser');		
const session = require('client-sessions');
const middleware = require('../../system/helpers/Middleware');

const HomeController = require('../controllers/HomeController');

const home = new HomeController();

module.exports = (function route() {
  router.use(parser.urlencoded({ 'extended': true}));		
  router.use(parser.json());		
  router.use(session(middleware.sessionObject));
  router.use(middleware.checkSession);

  router.get('/', middleware.requireLogin, home.index);

  return router;
});