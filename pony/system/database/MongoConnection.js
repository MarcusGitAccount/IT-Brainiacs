'use strict';

const mongoose = require('mongoose');

let instance;
const _db = Symbol('_db');

class MongoConnection {
  constructor() {
    console.log('Connected to mongo');
    mongoose.connect('mongodb://localhost/pony');
    mongoose.Promise = global.Promise;
    this[_db] = mongoose.connection;
  }
  
  getConnection() {
    return this[_db];
  }
}

module.exports = function singleton() {
  if (!instance)
    instance = new MongoConnection();
    
  return instance;
};