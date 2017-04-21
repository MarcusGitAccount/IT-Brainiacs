'use strict';

const EntriesApi = require('../api/EntriesApi');
const middleware = require('../../system/helpers/Middleware');
const router = require('../../system/helpers/BaseRouter').apiRouter;
const entries = new EntriesApi();

module.exports = (function route() {
  router.get('/page', entries.page);
  router.get('/trip/:id', entries.trip);
  router.get('/trip/:id/size', entries.tripSize);
  router.get('/size', entries.size);
  router.post('/inpolygon', entries.tripsInPolygon);
  router.post('/routedata', entries.routeData); 
  router.post('/betweendates', entries.routeBetweenDates);
  
  return router;
});