'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, `weather/weather.${process.argv[2]}`);

console.log(process.argv, '***')

function dateSet(start, end, month) {
  this.start = start;
  this.end = end;
  this.month = month;
}

function getURL(key, city, format, tp, start, end) {
  return `http://api.worldweatheronline.com/premium/v1/past-weather.ashx?` + 
         `key=${key}&q=${city}&format=${format}&date=${start}&enddate=${end}&tp=${tp}`;
}

function appendJSON(response, FILE) {
  response.forEach(item => {
    fs.appendFile(FILE, JSON.stringify(item), (err) => {
      if (err)  {
        console.log(err);
        return ;
      }
    });
  });
}

function appendCSV(response, FILE, SEPARATOR = ';') {
  response.forEach(item => {
    const arr = [];
    
    Object.keys(item).forEach(key => arr.push(item[key]));
    
    fs.appendFile(FILE, `${arr.join(SEPARATOR)}\n`, (err) => {
      if (err)  {
        console.log(err);
        return ;
      }
    });
  });
}

function writeToFile(path) {
  console.log(path)
  
  const KEY    = 'e6c45ad7e2a1491f9be95818170904';
  const TP     = 1;
  const CITY   = 'Cluj-Napoca';
  const FORMAT = 'json';
  
  const dates = [
    new dateSet('2016-11-05', '2016-11-30', 'november'),
    new dateSet('2016-12-01', '2016-12-31', 'december'),
    new dateSet('2017-01-01', '2017-01-31', 'january'),
    new dateSet('2017-02-01', '2017-02-28', 'february'),
    new dateSet('2017-03-01', '2017-03-31', 'march'),
    new dateSet('2017-04-01', '2017-04-30', 'april'),
    new dateSet('2017-05-01', '2017-05-31', 'may')
  ];
  
  console.log(getURL(KEY, CITY, FORMAT, TP, dates[0].start, dates[0].end));
  
  dates.forEach(_set => {
    fetch(getURL(KEY, CITY, FORMAT, TP, _set.start, _set.end), {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      body: {}
    }).then(response => response.json())
      .then(response => {
        const hourly = [];
        
        response.data.weather.forEach(day => {
          if (day.hourly.length !== 24)
            console.log(day.date, day.hourly.length);
          
          day.hourly.forEach(part => {
            let dayObject = {};
            
            if (part.time.length === 3)
              part.time = `0${part.time}`;
            else if (part.time.length === 1)
              part.time = `000${part.time}`;
            
            
            dayObject = {
              date: `${day.date}_${part.time.substr(0, 2)}:${part.time.substr(2, 2)}`,
              maxtempC: day.maxtempC,
              mintempC: day.mintempC,
              totalSnow_cm: day.totalSnow_cm,
              sunHour: day.sunHour,
              time: part.time,
              tempC: part.tempC,
              windspeedKmph: part.windspeedKmph,
              weatherCode: part.weatherCode,
              precipMM: part.precipMM,
              humidity: part.humidity,
              visibility: part.visibility,
              pressure: part.pressure,
              cloudcover: part.cloudcover,
              HeatIndexC: part.HeatIndexC
            };
            
            hourly.push(dayObject);
          });
        });
        
        return hourly;
      })
      .then(response => {
        (process.argv[2] === undefined) 
          ? appendCSV(response, FILE)
          : (process.argv[2] === 'json')
            ? appendJSON(response, FILE)
            : appendCSV(response, FILE);
      })
      .catch(error => {throw error});
      
  });
}

//module.exports = writeToFile;

writeToFile(FILE);