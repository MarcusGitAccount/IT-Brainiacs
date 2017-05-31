'use strict';

const url = require('url');
const Entries = require('../models/Entries');
const Route = require('../../system/helpers/Route');

const entries = new Entries();
const Learning = require('../../system/learning/Learning');


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
    entries.routeBetweenDates(request.body.polygon, request.body.dates.start, request.body.dates.end, (error, result, fields) => {
      const route = new Route(request.body.route.routePoints, request.body.route.steps);
      
      if (error) {
        response.status(204).json(error);
        return ;
      }
      
      //response.status(200).json(result);
      response.status(200).json(route.getResultFromRouteBetweenDates(result));
    });
  }
  
  learn(request, response) {
    const learner = new Learning();
    const trainingSet = request.body.trainingSet;
    const tests       = request.body.tests;
    const results     = {
      data: tests,
      result: []
    };
    
    //console.log('post request received');
    //console.log(trainingSet[0].input.length)
    
    trainingSet.map(i => i.output = learner.createOutputSpeedArray(i.output));
    learner.train(trainingSet, trainingSet.length);    
    
    for (let i = 0; i < tests.length; i++) {
      results.result.push([]);
      for (let j = 0; j < tests[i].length; j++) {
        //console.log(tests[i][j]);
        results.result[i].push(learner.testData(tests[i][j]));
      }
    }
    
    //console.log(results.result);
    
    response.status(200).json(results);
    
    
  }
}

module.exports = EntriesApi;