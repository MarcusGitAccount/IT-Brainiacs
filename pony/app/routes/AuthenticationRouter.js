'use strict';


const AuthenticationController = require('../controllers/AuthenticationController');
const router = require('../../system/helpers/BaseRouter').controllerRouter;

const authentication = new AuthenticationController();

module.exports = (function route() {
  router.get('/', authentication.index);
  router.post('/login', authentication.login);
  router.post('/register', authentication.register);
  router.get('/logout', authentication.logout);
  
  return router;
});