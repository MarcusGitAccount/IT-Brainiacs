'use strict';

const constants = require('../utils/constants');
const DeepClone = require('./DeepClone');

const deepClone = new DeepClone();

function resultObject() {
  this.speed = 0;
  this.time = 0;
  this.cars = 0;
}

function singleDayObject() {
  this.morning = new resultObject();
  this.noon = new resultObject();
  this.evening = new resultObject();
  this.night = new resultObject();
}

class Route {
  constructor(route, steps, dates) {
    this.route = route;
    this.steps = steps;
    this.routeTripIds = {};
    this.dates = deepClone.newObject(dates);
    this.result = new resultObject();
    this.resultBetweenDates = {
      distance: 0,
      error: null
    };
    this.routeTripIdsBetweenDates = {
      
    };
  }
  
  getDayPart(hour) {
    if (hour >= 6 && hour < 12)
      return 'morning';
    if (hour >= 12 && hour < 18)
      return 'noon';
    if (hour >= 18 && hour < 22)
      return 'evening';
    return 'night';
  }
  
  transformDistance(textDistance) {
    const split = textDistance.split(' ');
    const value = parseFloat(split[0]) || 0;
    const unit  = split[1] || 'm';
    
    return value * constants.distanceSI[unit];
  }
  
  B_in_AC(A, B, C) {
    const X = [A.x, C.x].sort();
    const Y = [A.y, C.y].sort();
    const sum = (A.x * B.y + A.y * C.x + B.x * C.y) - (C.x * B.y + A.x * C.y + A.y * B.x);
    
    if (B.x < X[0] || B.x > X[1])
      return false;
    if (B.y < Y[0] || B.y > Y[1])
      return false;
    
    return (sum >= constants.EPSILON.inf && sum <= constants.EPSILON.sup) ? true : false;
  }
  
  getDistance() {
    return this.steps.reduce((sum, current) => { return sum += current.distance.value; }, 0);
  }
  
  processData(data) {
    if (!data || data.length === 0) {
      this.result = {error: 'Something went teribly wrong, sorry'};
      return ;
    }
    
    this.routeTripIds = {};
    data.forEach((row, i) => {
      const B = {x: row.lat, y: row.lon};
      
      for (let index = 1; index < this.route.length; index++) {
        const A = {x: this.route[index - 1].lat, y: this.route[index - 1].lng};
        const C = {x: this.route[index].lat,    y: this.route[index].lng};
      
        if (this.B_in_AC(A, B, C)) {
          if (!(row.trip_id in this.routeTripIds))
            this.routeTripIds[row.trip_id] = {total: 0, records: 0};
            
          this.routeTripIds[row.trip_id].total += row.speed;
          this.routeTripIds[row.trip_id].records++;
        }
      }
    });
  }
  
  getResultsFromNormalRoute(data) {
    this.processData(data);
    if (this.result.error)
      return this.result;
    
    this.result.distance = this.getDistance();
    Object.keys(this.routeTripIds).forEach(current => this.result.speed += this.routeTripIds[current].total / this.routeTripIds[current].records);
    this.result.cars = Object.keys(this.routeTripIds).length;
    this.result.speed = (this.result.speed /= this.result.cars).toFixed(2);
    this.result.time = ((this.result.distance / 1000) / this.result.speed * 60).toFixed(2);
    this.result.distance = (this.result.distance / 1000).toFixed(2);

    return this.result;
  }
  
  processDataBetweenDates(data) {
    if (!data || data.length === 0) {
      this.resultBetweenDates = {error: 'Something went teribly wrong, sorry'};
      return ;
    }
  
    this.routeTripIdsBetweenDates = {};
    data.forEach((row, i) => {
      const B = {x: row.lat, y: row.lon};
      
      for (let index = 1; index < this.route.length; index++) {
        const A = {x: this.route[index - 1].lat, y: this.route[index - 1].lng};
        const C = {x: this.route[index].lat,    y: this.route[index].lng};
      
        if (this.B_in_AC(A, B, C)) {
          const dayPart = this.getDayPart(row.hour);

          if (!(row.date in this.routeTripIdsBetweenDates))
            this.routeTripIdsBetweenDates[row.date] = {'morning': {}, 'noon': {}, 'evening': {}, 'night': {}};
          if (!(row.trip_id in this.routeTripIdsBetweenDates[row.date][dayPart]))
            this.routeTripIdsBetweenDates[row.date][dayPart][row.trip_id] = {total: 0, records: 0};
            
          this.routeTripIdsBetweenDates[row.date][dayPart][row.trip_id].total += row.speed;
          this.routeTripIdsBetweenDates[row.date][dayPart][row.trip_id].records++;
        }
      }
    });
  }
  
  getResultFromRouteBetweenDates(data) {
    this.processDataBetweenDates(data);
    if (this.resultBetweenDates.error)
      return this.resultBetweenDates;
    

    this.resultBetweenDates.distance = this.getDistance();
    Object.keys(this.routeTripIdsBetweenDates).forEach(date => {
      console.log("149 %s", date);
      this.resultBetweenDates[date] = new singleDayObject();
      Object.keys(this.routeTripIdsBetweenDates[date]).forEach(dayPart => {
        console.log("152 %s", dayPart);
        Object.keys(this.routeTripIdsBetweenDates[date][dayPart]).forEach(current => {
           this.resultBetweenDates[date][dayPart].speed += this.routeTripIdsBetweenDates[date][dayPart][current].total / this.routeTripIdsBetweenDates[date][dayPart][current].records;
        });
        
        this.resultBetweenDates[date][dayPart].cars = Object.keys(this.routeTripIdsBetweenDates[date][dayPart]).length;
        this.resultBetweenDates[date][dayPart].speed = (this.resultBetweenDates[date][dayPart].speed /= this.resultBetweenDates[date][dayPart].cars).toFixed(2);
        this.resultBetweenDates[date][dayPart].time = ((this.resultBetweenDates.distance / 1000) / this.resultBetweenDates[date][dayPart].speed * 60).toFixed(2);
      });
    });
    //console.log("line 149", JSON.stringify(this.resultBetweenDates, null, 2));
    
    return this.resultBetweenDates;
  }
}

module.exports = Route;