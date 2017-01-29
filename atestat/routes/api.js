
'use strict';

module.exports = (() => {
  const multer = require('multer');
  const path = require('path');
  const session = require('client-sessions');
  const bcrypt = require('bcryptjs');
  const express = require('express');
  const fs = require('fs');
  const rootFolder = path.dirname(require.main.filename);
  const upload = multer({'dest': path.join(rootFolder, '/public/upload')})
  const dblogic = require('../models/dblogic');
  const router = require('express').Router();
  const url = require('url');
  const tables = dblogic.tables;

  router.use(require('body-parser').urlencoded({ 'extended': true}));
  router.use(require('body-parser').json());

  router.get('/', (request, response) => {
    response.end('Web api for serving this project\'s db');
  });

  router.get('/administrators', (request, response) => {
    let query = url.parse(request.url, true).query;

    dblogic.selectAndSort('administrators', query, 'id', 'name', 'email', 'registration_date').then(
      (result) => {
        response.json(result);
    });
  });

  router.get('/administrators/:id', (request, response) => {
    // if (tables.indexOf(request.params.name.toLowerCase()) === -1) response.json({'error': 'No such table in db'});
    dblogic.selectById('administrators', parseInt(request.params.id), 'id', 'name', 'email', 'registration_date').then((result) => {
      response.json(result);
    });
  });

  router.get('/ingredients', (request, response) => {
    let query = url.parse(request.url, true).query;

    dblogic.selectAndSort('ingredients', query, 'id', 'name', 'quantity', 'price', 'photo').then(
      (result) => {
        response.json(result);
    });
  });

  router.get('/ingredients/:id', (request, response) => {
    let query = url.parse(request.url, true).query;

    dblogic.selectById('ingredients', parseInt(request.params.id), 'id', 'name', 'quantity', 'price', 'photo').then(
      (result) => {
        response.json(result);
    });
  });

  router.get('/size/:table', (request, response) => {
    if (tables.indexOf(request.params.table.toLowerCase()) === -1) {
      response.json({'error': 'No such table in db', 'size': 0});
    }

    dblogic.getSize(request.params.table.toLowerCase()).then(result => {
      response.json(result);
    });
  });


  router.post('/ingredients', upload.any(), (request, response) => {
    console.log(request.body, request.files);
    let newPath = path.join(request.files[0].destination, request.files[0].originalname);

    fs.rename(request.files[0].path, newPath, error => {
      if (error) response.end('Error while uploading image');
    });

    dblogic.insertColumns('ingredients', {
      'name': request.body.name.trim().toLowerCase(),
      'quantity': request.body.quantity.trim(),
      'price': request.body.price.trim(),
      'PHOTO': request.files[0].originalname
    });
    response.end('Added ingredient');
  });

  router.delete('/ingredients', (request, response) => {
    fs.unlink(path.join(rootFolder, '/public/upload', request.body.image), error => {
      if (error) response.end('Error when deleting image');
    });
    let result = dblogic.deleteIngredientByName(request.body.name);
    response.json(result);
  });

  router.get('/employees', (request, response) => {
    let query = url.parse(request.url, true).query;

    dblogic.selectAndSort('employees', query, 'id', 'first_name', 'last_name', 'email', 'phone_number', 'salary', 'job_name', 'hire_date').then(result => response.json(result));
  });

  router.get('/employees/:id', (request, response) => {
    dblogic.selectById('employees', parseInt(request.params.id), 'first_name', 'last_name', 'email', 'phone_number', 'salary', 'job_name', 'hire_date').then(result => response.json(result));
  });

  return router;
});