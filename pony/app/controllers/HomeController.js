'use strict';

const path = require('path');
const middleware = require('../../system/helpers/Middleware');

class HomeController {
  index(request, response) {
    response.render(path.join('home', 'index.ejs'), {
      model: { 
        title: 'Home page',
        content: 'Home page content. Index.',
        error: ''
      }
    });
  }
}

module.exports = HomeController;