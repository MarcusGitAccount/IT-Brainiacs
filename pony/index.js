'use strict';

const express = require('express');

const adminRoute = require('./app/routes/AdministratorsRouter')();

const app = express();

app.use('/api/admins', adminRoute);

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});



/*
const Entries = require('./app/models/Entries');

const entries = new Entries();

entries.selectAll((err, result, fields) => {
  if (err)
    throw err;
  console.log(JSON.stringify(result, null, 2));
});

*/
// controller when rendering views, api when only getting data