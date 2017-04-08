'use strict';

const mysql = require('mysql');

let instance;

class DataBase {
  constructor(config) {
    console.log("Connected to mysql");
    this.connectionPool = mysql.createPool(config);
  }

  getConnection(callback) {
    this.connectionPool.getConnection(callback);
  }
}

module.exports = function singleton(config) {
  if (!instance) {
    instance = new DataBase(config);
  }
  
  return instance;
}