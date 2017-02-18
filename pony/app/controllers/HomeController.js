'use strict';

const path = require('path');

class HomeController {
  index(request, response) {/*
    response.layout('layout', {title: "Homepage" }, {
      content: {
        block: path.join('home', 'index.ejs'), 
        data: {

        }
      }
    });*/

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