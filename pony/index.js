'use strict';
'use strict';

const express = require('express');
const path = require('path');
const ejs_layouts = require('ejs-layouts');

const adminRoute = require('./app/routes/AdministratorsRouter')();
const entriesRoute = require('./app/routes/EntriesRouter')();
const homeRoute = require('./app/routes/HomeRouter')();

const app = express();

app.set('case sensivitive routing', false);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));
app.set('layout extractScripts', true);
app.locals.pretty = true;

app.use(ejs_layouts.express);

app.use('/assets', express.static(path.join(__dirname, 'app/assets')))
app.use('/api/admins', adminRoute);
app.use('/api/entries', entriesRoute);

app.use('/home', homeRoute);

const listener = app.listen(process.env.PORT || 8080, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});