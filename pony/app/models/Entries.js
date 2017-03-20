'use strict';

const mysql = require('mysql');

const BaseModel = require('../../system/helpers/BaseModel');

class Entries extends BaseModel {
  constructor(data) {
    super(data);
    this.tableName = 'entries';
  }
  
  tripSize(where, callback) {
    const statement = mysql.format('select count(id) as "size" from ?? where ?', [this.tableName, where]);
    
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }

      callback(null, result, fields);
    });
  }
  
  tripPagination(where, limit, offset, callback) {
    let statement = '';
    
    if (!limit && !offset) {
      limit = this.constants.LIMIT_MAX;
      offset = this.constants.SKIP_MIN;
    }
    
    if (typeof limit === 'function') {
      callback = limit;
      limit = this.constants.LIMIT_MAX;
      offset = this.constants.SKIP_MIN;
    }
    
    if (typeof offset === 'function') {
      callback = offset;
      offset = this.constants.SKIP_MIN;
    }
    
    statement = mysql.format(`select * from ?? where ? limit ${limit} offset ${offset}`, [this.tableName, where]);
    console.log(statement);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
  
  tripsInPolygon(polygon, callback) {
    const statement = mysql.format(`select car_qnr, count(distinct trip_id) as "trip_count", count(trip_id) as "records", 
    round(min(speed), 2) as "speed_min", round(max(speed), 2) as "speed_max", round(avg(coalesce(speed, 0)), 2) as "speed_avg", 
    round(avg(coalesce(rate, 0)), 2) as "rate_avg" 
    from entries where contains(GeomFromText('polygon((${polygon}))'), GeomFromText(concat('point(', lat, ' ', lon, ')'))) 
    group by car_qnr with rollup`, [this.tableName]);
    
    console.log(statement);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      
      callback(null, result, fields);
    });
  }
  
  routeData(route, polygon, days, callback) {
    const statement = mysql.format(`select * from ?? 
    where contains(GeomFromText('polygon((${polygon}))'), GeomFromText(concat('point(', lat, ' ', lon, ')')))  
    and date_format(from_unixtime(unix_timestamp(timestamp)), '%d-%m-%Y') = date_format(date_sub(now(), interval ${days} day), '%d-%m-%Y')`, [this.tableName]);
    
    console.log('route statement: %s', statement);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      
      callback(null, result, fields);
    });
  }
  
  routeBetweenDates(polygon, start, end, callback) {
    const statement = mysql.format(`select *, @date := date_format(from_unixtime(unix_timestamp(timestamp)), '%m-%d-%Y') as date, 
      @hour := convert(date_format(from_unixtime(unix_timestamp(timestamp)), '%H'), UNSIGNED INTEGER) as hour from ?? 
      where (date_format(from_unixtime(unix_timestamp(timestamp)), '%m-%d-%Y')
      between date_format(from_unixtime(unix_timestamp(?)), '%m-%d-%Y') 
      and date_format(from_unixtime(unix_timestamp(?)), '%m-%d-%Y')) 
      and contains(GeomFromText('polygon((${polygon}))'), GeomFromText(concat('point(', lat, ' ', lon, ')'))) 
      order by date and hour asc`, [this.tableName, start, end]);
  
    console.log(statement);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      
      callback(null, result, fields);
    });
  }
}

module.exports = Entries;