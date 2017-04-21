'use strict';

const User = require('../../app/models/User');

const user = new User();

module.exports = {
  sessionObject: {
    cookieName: 'session',
    secret: 'Oh, you really want to know? Never!',
    duration: 60 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    ephemeral: true
  },
  checkSession: (request, response, next) => {
    console.log(request.session, 'line 9');
    if (request.session && request.session.user) {
      user.selectUser({name: request.session.user.name, password: request.session.user.password}, (err, result) => {
        if (err) {
          return console.error(err, 'line 12 middleware');
        }
        
        if (result) {
          delete result.password;
          request.user = result;
          request.session.user = result;
          response.locals.user = result;
        }
        
        next();
      });
    }
    else next();
  },
  requireLogin: (request, response, next) =>  {
    if (!request.user) response.redirect('/authentication');
    else next();
  }
};