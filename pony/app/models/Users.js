'use strict';

// 27017

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  id: ObjectId,
  name: {type: String, unique: true, min: 3, match: /\S+/},
  email: {type: String, unique: true, min: 5, match: /.+@.+\.\w+/},
  password: {type: String, min: 6},
  registrationDate: {type: String, default: Date.now}
});

mongoose.connect('mongodb://46.226.109.110/pony');
