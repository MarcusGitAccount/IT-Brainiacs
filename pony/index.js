'use strict';

const express = require('express');

const adminRoute = require('./app/routes/admins')();

const app = express();

app.use('/api/admins', adminRoute);

const listener = app.listen(process.env.PORT, process.env.IP, () => {
  console.log(`Server up and running on http://${listener.address().address}:${listener.address().port}`);
});

/*
const Administrator = require('./app/models/Administrators');
const admins = new Administrator({id: 4, name: 'Smith', password: 'smith_pass_123_abc', email: 'smith@gmail.com'});

console.log(admins);

admins.selectAll(2, 2, (err, result, fields) => {
  if (err)
    throw err;
  console.log(JSON.stringify(result, null, 2));
});
*/

// controller when rendering views, api when only getting data