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
    const statement = mysql.format(`select lat, lon, trip_id from ?? where contains(GeomFromText('polygon((${polygon}))'), GeomFromText(concat('point(', lat, ' ', lon, ')')))`, [this.tableName])
    
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