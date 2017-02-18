'use strict';

const BaseModel = require('../../system/helpers/BaseModel');

class Entries extends BaseModel {
  constructor(data) {
    super(data);
    this.tableName = 'entries';
  }
}

module.exports = Entries;