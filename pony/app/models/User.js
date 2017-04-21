'use strict';

// 27017

const mongoose = require('mongoose');

const Connection = require('../../system/database/MongoConnection')();

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  id: ObjectId,
  name: {type: String, unique: true, match: /\S+/},
  email: {type: String, unique: true, match: /.+@.+\.\w+/},
  password: {type: String, min: 6},
  registrationDate: {type: String, default: Date.now}
});

const User = mongoose.model('User', UserSchema);

class UserModel {
  insert(data, callback) {
    const user = new User(data);
    
    user.save((err, result) => {
      if (err) {
        callback(err);
        return ;
      }
      
      callback(null, result);
    });
  }
  
  selectUser(data, callback) {
    User.findOne(data, (err, result) => {
      if (err) {
        callback(err);
        return ;
      }
      
      callback(null, result);
    });
  }
}

module.exports = UserModel;