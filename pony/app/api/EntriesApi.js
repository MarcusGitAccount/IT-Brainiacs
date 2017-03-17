'use strict';

const url = require('url');
const Entries = require('../models/Entries');
const Route = require('../../system/helpers/Route');

const entries = new Entries();

class EntriesApi {
  page(request, response) {
    const query = url.parse(request.url, true).query;
    
    entries.selectAll(query.limit, query.offset, (error, result, fields) => {
      if (error) {
        console.log(error);
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(result);
    });
  }
  
  trip(request, response) {
    const query = url.parse(request.url, true).query;

    entries.tripPagination({trip_id: request.params.id}, query.limit, query.offset, (error, result, fields) => {
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(result);
    });
  }
  
  tripSize(request, response) {
    entries.tripSize({trip_id: request.params.id}, (error, result, fields) => {
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(result[0]);
    });
  }
  
  size(request, response) {
    entries.size((error, result, fields) => {
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(result[0]);
    });
  }
  
  tripsInPolygon(request, response) {
    entries.tripsInPolygon(request.body.polygon, (error, result, fields) => {
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(result);
    });
  }
  
  routeData(request, response) {
    entries.routeData(request.body.route, request.body.polygon, request.body.days, (error, result, fields) => {
      const route = new Route(request.body.route.routePoints, request.body.route.steps);

      if (error) {
        response.status(204).json(error);
        return ;
      }

      response.status(200).json(route.getResultsFromNormalRoute(result));
    });  
  }
  
  routeBetweenDates(request, response) {
    console.log("here I am");
    entries.routeBetweenDates(request.body.polygon, request.body.dates.start, request.body.dates.end, (error, result, fields) => {
      const route = new Route(request.body.route.routePoints, request.body.route.steps);
      
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      response.status(200).json(route.getResultsFromNormalRoute(result));
    });
  }
}

module.exports = EntriesApi;