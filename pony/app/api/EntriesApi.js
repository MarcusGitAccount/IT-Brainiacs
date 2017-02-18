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
        response.status(204).end(error);
        return ;
      }
      
      response.status(200).json(result);
    });
  }
  
  trip(request, response) {
    entries.selectAllByCondition({trip_id: request.params.id}, (error, result, fields) => {
      if (error) {
        response.status(204).end(error);
        return ;
      }
      
      response.status(200).json(result);
    });
  }
  
  size(request, response) {
    entries.size((error, result, fields) => {
      if (error) {
        response.status(204).end(error);
        return ;
      }
      
      response.status(200).json(result[0]);
    });
  }
}

module.exports = EntriesApi;