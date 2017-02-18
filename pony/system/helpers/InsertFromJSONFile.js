'use strict';

const fs = require('fs');
const Entries = require('../../app/models/Entries');
const entries = new Entries();

class InsertFromJSONFile {
  insertFromFile(path) {
    fs.readFile(path, (error, data) => {
      if (error) {
        console.log('error, sunshine');
        return;
      }

      const json = JSON.parse(data.toString('utf-8'));

      json.forEach(row => {
        entries.insert(row, (error, result) => {
          if (error) {
            console.log(error);
            return;
          }
        })
      });
    });
  }
}

module.exports = InsertFromJSONFile;
