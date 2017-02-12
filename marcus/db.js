'use strict'

let instance = null;
class Test {
  constructor() {
    if(!instance){
      instance = this;
    }
    
    // to test whether we have singleton or not
    this.time = new Date()
    return instance;
  }
  
}

module.exports = new Test();



        

        