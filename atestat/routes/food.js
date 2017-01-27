
'use strict';

module.exports = (function() {
  let router = require('express').Router();
  let modelList = ['Potato', 'Onion', 'Pizza', 'Chips', 'Pasta'];

  router.use(require('body-parser').urlencoded({ 'extended': true}));
  router.use(require('body-parser').json());
  router.post('/', (request, response) => {
    console.log(JSON.stringify(request.body));
    modelList.push(request.body.food_item);
    response.redirect(request.originalUrl);
  });

  router.post('/login', (request, response) => {
    response.redirect('/food');
  });

  router.post('/register', (request, response) => {
    response.redirect('/food');
  });

  router.get('/', (request, response) => {
    response.render('food', {
      'model': {
        'title': 'Index.html',
        'header': 'Page header',
        'list': modelList
      }
    });
    response.end('Hello to food');
  });

  return router;
});