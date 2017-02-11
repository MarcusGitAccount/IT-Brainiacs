'use strict';

class Admin {
  get(req, res) {
    res.send({ test: "test"});
  }  
}

module.exports = new Admin();