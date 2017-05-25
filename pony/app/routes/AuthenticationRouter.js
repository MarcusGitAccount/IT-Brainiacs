'use strict';


const AuthenticationController = require('../controllers/AuthenticationController');
//const router = require('../../system/helpers/BaseRouter').authRouter;
const middleware = require('../../system/helpers/Middleware');
const router = require('express').Router();		
const parser = require('body-parser');		
const bcrypt = require('bcryptjs');		
const session = require('client-sessions');		
const csrf = require('csurf');
const authentication = new AuthenticationController();

module.exports = (function route() {
router.use(parser.urlencoded({ 'extended': true}));		
 router.use(parser.json());		
 router.use(session(middleware.sessionObject));		
 router.use(csrf());
  
  router.get('/', authentication.index);
  router.post('/login', authentication.login);
  //router.post('/register', authentication.register);
  router.get('/logout', authentication.logout);
  
  return router;
});