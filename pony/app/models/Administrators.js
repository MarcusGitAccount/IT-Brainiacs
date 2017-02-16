// IP: 173.194.240.120
// l: marcus2
// p: -`=$7=eNw$~hD#G`


// mysql -uuser -hhostname -PPORT -ppasswordmy

'use strict';

const BaseModel = require('../../system/helpers/BaseModel');

class Administrators extends BaseModel {
  constructor(data) {
    super(data);
    this.tableName = 'administrators';
  }
  
}

module.exports = Administrators;