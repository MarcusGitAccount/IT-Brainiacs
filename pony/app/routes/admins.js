'use strict';

const router = require('express').Router();
const parser = require('body-parser');
const AdministratorsAPI = require('../api/AdministratorsAPI');

const admins = new AdministratorsAPI();

module.exports = (function route() {
  
  router.use(parser.urlencoded({ 'extended': true}));
  router.use(parser.json());
  
  router.get('/', admins.get);
  router.get('/:id', admins.getById);
  router.post('/', admins.post);
  router.put('/', admins.put);
  router.delete('/', admins.delete);
  
  return router;
});