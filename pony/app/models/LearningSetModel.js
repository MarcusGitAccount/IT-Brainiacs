'use strict';

const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

const BaseModel = require('../../system/helpers/BaseModel');

function appendCSV(response, FILE, SEPARATOR = ';') {
  response.forEach((item, index) => {
    const arr = [];
    
    item.id = index;
    Object.keys(item).forEach(key => arr.push(item[key]));
    
    fs.appendFile(FILE, `${arr.join(SEPARATOR)}\n`, (err) => {
      if (err)  {
        console.log(err);
        return ;
      }
    });
  });
}

class LearningSet extends BaseModel {
  constructor(data) {
    super(data);
    this.tableName = 'consolidated';
  }
  
  toCSV(path) {
    const statement = `
    select *
      from consolidated
      where contains(GeomFromText('polygon((46.763232200869936 23.572846055030823, 46.764143520130624 23.573961853981018, 46.76436813223761 23.574331998825073, 46.764760856677476 23.575061559677124, 46.765128315549056 23.576316833496094, 46.7653598133512 23.576965928077698, 46.76678552391651 23.58089804649353, 46.76699496790832 23.581348657608032, 46.768303055816986 23.584041595458984, 46.76875867448317 23.58487844467163, 46.76899451993012 23.585392087697983, 46.76893297516137 23.58544170856476, 46.76871825685406 23.585093021392822, 46.768652118850056 23.58494281768799, 46.7681671043394 23.584084510803223, 46.76757552769855 23.58287751674652, 46.76748734180434 23.582716584205627, 46.76675980266837 23.58113408088684, 46.76593671624364 23.579079508781433, 46.765080546037495 23.576611876487732, 46.76465061852726 23.57518494129181, 46.7645697770737 23.5749489068985, 46.764444840043225 23.574712872505188, 46.76394508902384 23.57391893863678, 46.76356659803432 23.573479056358337, 46.76329467082752 23.57317864894867, 46.76313298372954 23.57294261455536, 46.763232200869936 23.572846055030823))'), GeomFromText(concat('point(', lat, ' ', lon, ')')))
      union 
      select * from consolidated where id = 1`;
    
    this.query(statement, (error, data) => {
      if (error)
        return console.log(error);
      
      console.log(data.length)
      appendCSV(data, path, ',');
    });
  }
}

module.exports = LearningSet;