'use strict';

const router = require('express').Router();
const parser = require('body-parser');

const EntriesApi = require('../api/EntriesApi');

const entries = new EntriesApi();

module.exports = (function route() {
  router.use(parser.urlencoded({ 'extended': true}));
  router.use(parser.json());
  
  router.get('/page', entries.page);
  router.get('/trip/:id', entries.trip);
  router.get('/trip/:id/size', entries.tripSize);
  router.get('/size', entries.size);
  router.post('/inpolygon', entries.tripsInPolygon);
  router.post('/routedata', entries.routeData);
  
  return router;
});