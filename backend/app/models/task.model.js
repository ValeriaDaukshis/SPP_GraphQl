'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.ObjectId;

var TaskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  isMade: {
    type: Boolean,
    required: true
  },
  user_id: {
    type: ObjectId,
    required: true
  },
});

module.exports = mongoose.model('tasks', TaskSchema);