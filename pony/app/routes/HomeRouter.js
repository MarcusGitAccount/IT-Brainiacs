'use strict';

const router = require('../../system/helpers/BaseRouter').controllerRouter;
const HomeController = require('../controllers/HomeController');
const middleware = require('../../system/helpers/Middleware');

const home = new HomeController();

module.exports = (function route() {
  router.use(middleware.checkSession);

  router.get('/', middleware.requireLogin, home.index);

  return router;
});