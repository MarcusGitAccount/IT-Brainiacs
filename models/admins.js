
const mysql = require("mysql");
const tableName = 'administrators';
const columns = ['id', 'name', 'password', 'email', 'registration_date'];
const connection = mysql.createConnection({
  'host': '0.0.0.0',
  'user': 'marcuspop',
  'password': '',
  'database': 'food.db',
  'port': 3306
});

connection.connect();

function makePromise(statement) {
  return new Promise((resolve, reject) => {
    connection.query(statement, (error, result, fields) => {
      if (error) {
        reject(error);
        return ;
      }
      
      resolve(result, fields);
    });
  });
}

module.exports = {
  'tableName': tableName,
  'columns': columns,
  'selectAll': () => {
    const statement = 'select * from administrators';
    
    return makePromise(statement);
  },
  'selectByColumns': (where) => {/* ?? = ? */
    const statement = mysql.format(`select * from administrators where ?`, where);

    return makePromise(statement);
  },
  'insert': (data) => {
    const statement = mysql.format(`insert into administrators set ?`, data);
    
    return makePromise(statement);
  },
  'update': (what, where) => {
    const statement = mysql.format('update administrators set ? where ?', [what, where]);
    
    return makePromise(statement);
  },
  'delete': (where) => {
    const statement = mysql.format('delete from administrators where ?', where);
    
    return makePromise(statement);
  }
};
