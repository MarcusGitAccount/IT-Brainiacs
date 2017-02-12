const db = {};
class Test {
  constructor() {
    this._db = db;
    console.log(db());
  }
  
  get db() {
    return this._db;
  }
}

const t = new Test();
