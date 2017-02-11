'use strict';

const BaseModel = require('../../system/helpers/BaseModel');

class Administrators extends BaseModel {
  constructor(data) {
    super(data);
    this.tableName = 'administrators';
  }
  
}

module.exports = Administrators;