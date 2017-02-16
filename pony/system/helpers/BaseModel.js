'use strict';

const mysql = require('mysql');

const config = require('../../config');
const db = require('../database/db')(config.db.connection);
const DeepClone = require('../helpers/DeepClone');
const constants = require('../utils/constants');

const deepClone = new DeepClone();

const _db = Symbol('_db');
const _checkIfTableExists = Symbol('_checkIfTableExists');

class BaseModel {
  constructor(data) {
    this.data = deepClone.newObject(data);
    this[_db] = db;
  }
  
  get db() {
    return this[_db];
  }
  
  get constants() {
    return constants;
  }
  
  
  [_checkIfTableExists]() {
    if (!this.tableName || !this.constants.tables.hasOwnProperty(this.tableName.toLowerCase()))
      throw 'Invalid table name.';
  }
  
  query(statement, callback) {
    this[_db].getConnection((error, connection) => {
      if (error){
        if (connection)
          connection.release();
        callback(error);
        
        return ;
      }
      
      connection.query(statement, (err, result, fields) => {
        connection.release();
        callback(err, result, fields);
      })
    })
  }

  save(callback) {
    if (!this.data || Object.keys(this.data) === 0) {
      return callback(new Error('Invalid data format'));
    }
    
    if (this.data.id) {
      this.selectAllByCondition(this.data, (err, result, id) => {
        if (err) {
          callback(err);
          return ;
        }
        
        console.log(result);
        if (result.length === 1) {
          const currentId = this.data.id;
          
          this.update(this.data, {id: this.data.id}, callback);
          this.data.id = currentId;
        }
        else {
          try {
            this.insert(this.data, (error, result, fields) => {
              if (error) {
                callback(error);
                return ;
              }
              
              this.data.id = result.insertId;
              callback(null, result, fields);
            });
          }
          catch (error) {
            console.log(error);
          }
        }
      });
    }
    else {
      try {
        this.insert(this.data, (error, result, fields) => {
          if (error) {
            callback(error);
            return ;
          }
          
          this.data.id = result.insertId;
          callback(null, result, fields);
        });
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  tableSize(callback) {
    this[_checkIfTableExists]();
    
    const statement = mysql.format('select count(*) as "size" from ??', this.tableName);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }

      callback(null, result, fields);
    });
  }

  selectAll(limit, offset, callback) {
    let statement = '';
    
    if (typeof limit === 'function') {
      callback = limit;
      limit = this.constants.LIMIT_MAX;
      offset = this.constants.SKIP_MIN;
    }
    
    if (typeof offset === 'function') {
      callback = offset;
      offset = this.constants.SKIP_MIN;
    }
    
    statement = mysql.format('select * from ?? limit ? offset ?', [this.tableName, limit, offset]);
    this[_checkIfTableExists]();
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
  
  selectAllByCondition(where, callback) {
    this[_checkIfTableExists]();
    
    let statement = mysql.format(`select * from ?? where ?`, [this.tableName, where]);
    
    statement = statement.replace(new RegExp(',', 'g'), ' AND ');
    console.log(statement);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
  
  insert(data, callback) {
    let statement = '';
    
    this[_checkIfTableExists]();
    if (this.constants[this.tableName].auto_increment)
      delete data.id;
      
    statement = mysql.format(`insert into ?? set ?`, [this.tableName, data]);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
  
  update(what, where, callback) {
    delete what.id;
    this[_checkIfTableExists]();
    
    const statement = mysql.format('update ?? set ? where ?', [this.tableName, what, where]);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
  
  delete(where, callback) {
    this[_checkIfTableExists]();

    const statement = mysql.format('delete from ?? where ?', [this.tableName, where]);
    this.query(statement, (err, result, fields) => {
      if (err) {
        callback(err);
        return ;
      }
      callback(null, result, fields);
    });
  }
}

module.exports = BaseModel;