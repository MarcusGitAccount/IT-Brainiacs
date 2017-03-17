'use strict';

const constants = require('../utils/constants');
const DeepClone = require('./DeepClone');

const deepClone = new DeepClone();

class Route {
  constructor(route, steps, dates) {
    this.route = route;
    this.steps = steps;
    this.routeTripIds = {};
    this.dates = deepClone.newObject(dates);
    this.result = {
      dates: {
        start: null,
        end: null
      },
      speed: 0,
      distance: 0,
      time: 0,
      cars: 0,
      error: null
    };
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
    
    console.log(sum);
    return (sum >= constants.EPSILON.inf && sum <= constants.EPSILON.sup) ? true : false;
  }
  
  getDistance() {
    return this.steps.reduce((sum, current) => sum += this.transformDistance(current.distance.text), 0);
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
            this.routeTripIds[row.trip_id] = {total: 0, records: 0, start: row.timestamp, end: row.timestamp};
            
            this.routeTripIds[row.trip_id].total += row.speed;
            this.routeTripIds[row.trip_id].end = row.timestamp;
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
    this.result.speed = Math.round(this.result.speed /= this.result.cars);
    this.result.time = ((this.result.distance / 1000).toFixed(2) / this.result.speed * 60).toFixed(2);
    this.result.distance = (this.result.distance / 1000).toFixed(2);

    return this.result;
  }
}

module.exports = Route;