'use strict';

const CONSTANTS = require('../constants');
const db = require('./db');

class DBGateway {
  constructor() {
    this._dbInstance = db;
  }

  getConnection(callback) {
    this.db.connection.getConnection(callback);
  }

  query(opts, callback) {
    this.getConnection((err, connection) => {
      if (err) {
        connection.release();

        return callback(err);
      }

      if (opts.typeCast === undefined || opts.typeCast === null) {
        opts.typeCast =  function(field, next) {
          if (field.type == 'TINY' && field.length == 1) {
            return (field.string() == '1'); // 1 = true, 0 = false
          }
          return next();
        }
      }

      connection.query(opts, (err, result, fields) => {
        connection.release();
        callback(err, result, fields);
      });
    });
  }

  get db() {
    return this._dbInstance();
  }

  get constants() {
    return CONSTANTS;
  }

  insert(data, callback) {
    const sql = `INSERT INTO ${this.table} SET ?`;

    this.query({
      sql: sql,
      values: [data]
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  }

  findById(id, callback) {
    const sql = `SELECT * FROM ${this.table} WHERE id = ?`;

    this.query({
      sql: sql,
      values: [id]
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  }

  getAll(limit, skip, callback) {
    const sql = `SELECT * FROM ${this.table} LIMIT ?,?`;

    if (typeof limit === 'function') {
      callback = limit;
      limit = DEF_LIMIT;
      skip = DEF_SKIP;
    }

    if (typeof skip === 'function') {
      callback = skip;
      skip = DEF_SKIP;
    }

    this.query({
      sql: sql,
      values: [skip, limit],
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  }

  update(id, data, callback) {
    const sql = `UPDATE ${this.table} SET ? WHERE id = ?`;

    // make sure that `id` does not change
    delete data.id;

    this.query({
      sql: sql,
      values: [data, id]
    }, (err, results) => {
      if (err) {
        return callback(err);
      }

      callback(null, results);
    });
  }
}

module.exports = DBGateway;