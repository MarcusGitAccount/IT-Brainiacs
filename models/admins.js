
const mysql = require("mysql");
const tableName = 'administrators';
const connection = mysql.createConnection({
  'host': '0.0.0.0',
  'user': 'marcuspop',
  'password': '',
  'database': 'food.db',
  'port': 3306
});

function prepareSQLConditionFromObject(data) {
  const conditions = [];
  const values = [];
  
  Object.keys(data).forEach(key => {
    conditions.push('?? = ?');
    values.push(key);
    values.push(data[key]);
  });
  
  return { conditions, values };
}

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
    const conditions = prepareSQLConditionFromObject(where).conditions;
    const values = prepareSQLConditionFromObject(where).values;
    values.splice(0, 0, 'administrators');
    const statement = mysql.format(`select * from ?? where ${conditions.join(' ')}`, values);

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
  }
}
