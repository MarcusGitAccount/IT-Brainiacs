'use strict';

const express = require('express');
const path = require('path');
const ejs_layouts = require('ejs-layouts');
const session = require('client-sessions');

const adminRoute = require('./app/routes/AdministratorsRouter')();
const entriesRoute = require('./app/routes/EntriesRouter')();
//const learnRoute = require('./app/routes/LearningRoute')();
const homeRoute = require('./app/routes/HomeRouter')();
const authenticationRoute = require('./app/routes/AuthenticationRouter')();
const middleware = require('./system/helpers/Middleware');

const LearningSet = require('./app/models/LearningSetModel');

//const _set = new LearningSet(); 

const User = require('./app/models/User');
const user = new User();

const app = express();

//const weatherData = require('./system/helpers/WeatherData')(path.join('../weather.csv'));

app.set('case sensivitive routing', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.set('layout extractScripts', true);
app.locals.pretty = true;

app.use(session(middleware.sessionObject));
app.use(ejs_layouts.express);

app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.use('/api/admins', adminRoute);
app.use('/api/entries', entriesRoute);
app.use('/authentication', authenticationRoute);

app.get('/', (request, response) => {
  console.log(request.session);
  if (request.session && request.session.user) {
    user.selectUser({name: request.session.user.name, password: request.session.user.password}, (err, result) => {
      if (err) {
        return console.error(err);
      }
      
      if (result) {
        delete result.password;
        response.locals.user = result;
        response.redirect('/home');
      }
      else {
        response.locals.user = {name: ''};
        request.session.reset();
        response.redirect('/authentication');
      }
    });
  }
  else
    response.redirect('/authentication');
});

app.use('/home', homeRoute);
app.use('*', (request, response) => {
  response.status(404);
  response.render('error.ejs');
});

const listener = app.listen(8080, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});