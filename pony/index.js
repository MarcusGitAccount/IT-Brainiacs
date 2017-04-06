'use strict';

const express = require('express');
const path = require('path');
const ejs_layouts = require('ejs-layouts');

const adminRoute = require('./app/routes/AdministratorsRouter')();
const entriesRoute = require('./app/routes/EntriesRouter')();
const homeRoute = require('./app/routes/HomeRouter')();
const authenticationRoute = require('./app/routes/AuthenticationRouter')();

const app = express();

app.set('case sensivitive routing', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.set('layout extractScripts', true);
app.locals.pretty = true;

app.use(ejs_layouts.express);

app.use('/assets', express.static(path.join(__dirname, 'app/assets')));
app.use('/api/admins', adminRoute);
app.use('/api/entries', entriesRoute);
app.use('/authentication', authenticationRoute);

app.get('/', (request, response) => {
  response.redirect('/home');
});

app.use('/home', homeRoute);
app.use('*', (request, response) => {
  response.status(404);
  response.render('error.ejs');
});

const listener = app.listen(8080, '46.226.109.110', () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});