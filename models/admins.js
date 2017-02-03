
const mysql = require("mysql");
const tableName = 'administrators';
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
  'selectByColumns': (where) => {/* ?? = ? */

    const statement = mysql.format(`select * from administrators where ?`, where);

    return new Promise((resolve, reject) => {
      connection.query(statement, (error, result, fields) => {
        if (error) {
          reject(error);
          return ;
        }
        
        resolve(result, fields);
      });
    });
  },
  'insert': (data) => {
    const statement = mysql.format(`insert into administrators set ?`, data);
    
    console.log(statement);
    return new Promise((resolve, reject) => {
      connection.query(statement, (error, result, fields) => {
        if (error) {
          reject(error);
          console.log(error)
          return ;
        }
        
        resolve(result, fields);
      });
    });
  },
  'update': (what, where) => {
    const statement = mysql.format('update administrators set ? where ?', [what, where]);
    
    console.log(statement);
    return new Promise((resolve, reject) => {
      connection.query(statement, (error, result, fields) => {
        if (error) {
          reject(error);
          console.log(error)
          return ;
        }
        
        resolve(result, fields);
      });
    });
  },
  'delete': (where) => {
    const statement = mysql.format('delete from administrators where ?', where);
    
    console.log(statement);
    return new Promise((resolve, reject) => {
      connection.query(statement, (error, result, fields) => {
        if (error) {
          reject(error);
          console.log(error)
          return ;
        }
        
        resolve(result, fields);
      });
    });
  }
}
