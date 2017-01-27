
'use strict';

module.exports = (function() {
  const multer = require('multer');
  const path = require('path');
  const session = require('client-sessions');
  const bcrypt = require('bcryptjs');
  const express = require('express');
  const fs = require('fs');
  let router = express.Router();
  let rootFolder = path.dirname(require.main.filename);
  let upload = multer({'dest': path.join(rootFolder, '/public/upload')})
  let dblogic = require('../models/dblogic');

  router.use(require('body-parser').urlencoded({ 'extended': true}));
  router.use(require('body-parser').json());
  router.use(session({
    'cookieName': 'session',
    'secret': 'Oh, you really want to know? Never!',
    'duration': 60 * 60 * 1000,
    'activeDuration': 5 * 60 * 1000,
    'httpOnly': true,
    'ephemeral': true
  }));

  router.use(function(request, response, next) {
    if (request.session && request.session.user) {
      dblogic.selectNamePassword(request.session.user.name, request.session.user.password).then(result => {
        if (result.rows.length === 1) {
          request.user = result.rows[0];
          // delete request.user.password;
          request.session.user = request.user;
          response.locals.user = request.user;
        }
        next();
      });
    }
    else next();
  });

  function requireLogin(request, response, next) {
    if (!request.user) response.redirect('/home');
    else next();
  }

  router.get('/', requireLogin, (request, response) => {
    response.render(path.join('dashboard', 'index.ejs'), {
      'model': { 'title': 'Dashboard', 'error': '' }
    });
  });

  router.get('/logout', (request, response) => {
    request.session.reset();
    response.redirect('/home');
  });

  router.get('/ingredients', requireLogin, (request, response) => {
    response.render(path.join('dashboard', 'ingredients.ejs'), {
      'model': { 'title': 'Ingredients', 'error': '' }
    });
  });

  router.get('/employees', requireLogin, (request, response) => {
    response.render(path.join('dashboard', 'employees.ejs'), {
      'model': { 'title': 'Employees', 'error': '' }
    });
  });

  return router;
});