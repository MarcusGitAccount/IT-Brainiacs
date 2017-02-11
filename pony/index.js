'use strict';
/*
const config = require('./config');
const express = require('express');

const admin = require('./app/controllers/admin');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/admin', admin.get);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});*/

const Administrator = require('./app/models/Administrators');
const admins = new Administrator();

console.log(admins);

admins.selectAll((err, result, fields) => {
  if (err)
    throw err;
  console.log(JSON.stringify(result, null, 2));
})
