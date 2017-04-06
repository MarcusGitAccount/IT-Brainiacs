'use strict';

const router = require('express').Router();
const parser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('client-sessions');
const csrf = require('csurf');

const AuthenticationController = require('../controllers/AuthenticationController');

const authentication = new AuthenticationController();

module.exports = (function route() {
  router.use(parser.urlencoded({ 'extended': true}));
  router.use(parser.json());
  router.use(session({
    'cookieName': 'session',
    'secret': 'Oh, you really want to know? Never!',
    'duration': 60 * 60 * 1000,
    'activeDuration': 5 * 60 * 1000,
    'httpOnly': true,
    'ephemeral': true
  }));
  router.use(csrf());
  
  router.get('/', authentication.index);
  
  return router;
});