'use strict';

const url = require('url');
const Entries = require('../models/Entries');
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
}

module.exports = EntriesApi;