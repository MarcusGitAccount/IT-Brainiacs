
'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('client-sessions');
const https = require('https');
const layouts = require('express-ejs-layouts');
const app = express();
let dblogic = require('./models/dblogic');
let home = require('./routes/home');
let api = require('./routes/api');
let food = require('./routes/food');
let dashboard = require('./routes/dashboard');

app.set('case sensivitive routing', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
app.engine('ejs', require('ejs-locals'));
app.set('layout extractScripts', true)
app.use(session({
    'cookieName': 'session',
    'secret': 'Oh, you really want to know? Never!',
    'duration': 60 * 60 * 1000,
    'activeDuration': 5 * 60 * 1000,
    'httpOnly': true,
    'ephemeral': true
  }));

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/food', food());
app.use('/api', api());
app.use('/home', home());
app.use('/dashboard', dashboard());

app.get('/', (request, response) => {
  console.log(request.session);
  if (request.session && request.session.user) {
    dblogic.selectNamePassword(request.session.user.name, request.session.user.password).then(result => {
      if (result.rows.length !== 1) {
        response.locals.user = {'name': ''};
        request.session.reset();
        response.redirect('/home');
      }
      else {
        response.locals.user = result.rows[0];
        response.redirect('/dashboard');
      }
    });
  }
  else
    response.redirect('/home');
});

app.get('*', (request, response) => {
  response.status(404);
  response.render('error.ejs', {
    'model': {
      'title': 'Page not found',
      'error': '404. Page requested not found on server',
      'image': '/public/images/404_2.png'
    }
  });
});

let httpsServer = https.createServer({
  'key': fs.readFileSync('SSL/key.pem').toString(),
  'cert': fs.readFileSync('SSL/cert.pem').toString()
}, app);

let listener = httpsServer.listen(8080, 'localhost', () => {
  console.log('Server up and running on https://%s:%s', listener.address().address, listener.address().port);
});