
const express = require("express");
const mysql = require("mysql");
const router = express();
const connection = mysql.createConnection({
  'host': '0.0.0.0',
  'user': 'marcuspop',
  'password': '',
  'database': 'food.db',
  'port': 3306
});

connection.connect();

module.exports = {
  'selectAll': () => {
    return new Promise((resolve, reject) => {
      connection.query('select * from administrators', (error, result, fields) => {
        if (error) {
          reject(error);
          return ;
        }
        
        resolve(result, fields);
      });
    });
  },
  'selectByColumns': (where) => {
    const conditions = [];
    const values = [];
    
    Object.keys(where).forEach(key => {
      conditions.push(`${key} = ?`);
      values.push(where[key]);
    });
    
    return new Promise((resolve, reject) => {
      connection.query(`select * from administrators where ${conditions.join(' ')}`, values, (error, result, fields) => {
        if (error) {
          reject(error);
          return ;
        }
        
        resolve(result, fields);
      });
    });
  }
}
