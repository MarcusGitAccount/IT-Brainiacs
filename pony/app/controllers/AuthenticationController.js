'use strict';

const bcrypt = require('bcryptjs');
const csurf = require('csurf');
const path = require('path');

class AuthenticationController {
  index(request, response) {
    const token = request.csrfToken();
    
    response.locals.csrfToken = token;
    response.render(path.join('authentication', 'index.ejs'), {
      model: {
        title: 'Login in/Sign up',
        content: 'Home page content. Index.',
        error: ''
      },
    });
  }
  
  login(request, response) {
    
  }
  
  response(request, response) {
    
  }
}

module.exports = AuthenticationController;