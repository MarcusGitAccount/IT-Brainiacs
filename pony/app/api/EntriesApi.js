'use strict';

const url = require('url');
const fetch = require('node-fetch');

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
  /*
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
  }*/
  
  learn(req, res) {
    const urls = {
      city: '',
      motilor: {
        url: 'https://ussouthcentral.services.azureml.net/workspaces/5b6a0af0601c47db862b1ee11cd4148c/services/bdee1267899341d89b5a8b81e2bf7f75/execute?api-version=2.0&details=true',
        key: '1ZaaNEQjoj8/CHcU/EdnHzYI7i8Uxzo5jJrfDntQHhvvKuEfAwEv+pTSJYkWhcXsQm3o3IIMSnDa0lUj/Im4Gw=='
      }
    };
  
    const KEY = 'f4b1454162b1451f93f140021170806';
    const URL = `http://api.worldweatheronline.com/premium/v1/weather.ashx?key=${KEY}&q=Cluj-Napoca` +
                `&format=json&num_of_days=1&date=tomorrow&tp=1`;
    
    console.log(req.params.type)
    fetch(URL, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: {}
    })
      .then(response => response.json())
      .then(response => {
        const Values = [];
        const ColumnNames = ["year", "month", "day", "hour", "snow", "temp", "precip", "visibility", "humidity" ];
        
        response.data.weather.forEach(day => {
          if (day.hourly.length === 24) {
            const date = day.date.split('-').map(item => parseInt(item));
            
            day.hourly.forEach(part => {
              const hour = parseInt(part.time);
              
              Values.push([
                date[0],
                date[1],
                date[2],
                parseInt(hour > 100 ? hour / 100 : hour),
                parseFloat(day.totalSnow_cm),
                parseInt(part.tempC),
                parseFloat(part.precipMM),
                parseInt(part.visibility),
                parseInt(part.humidity)
              ]);
            });
          } 
        });
        
        return {ColumnNames, Values};
      })
      .then(response => {
        const data = JSON.stringify({Inputs: {input1: response}});
        console.log(data);
        
        return fetch(urls[req.params.type].url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${urls[req.params.type].key}`,
            'Content-type': 'application/json',
            'Accept': 'application/json',
          },
         body: data,
        })
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        res.status(200).json(response)
      })
      .catch(error => res.status(400).send(error));
  }
} 

module.exports = EntriesApi;