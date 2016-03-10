'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  _school:{ type: Schema.ObjectId, ref: 'School' }, 
  _class: { type: Schema.ObjectId, ref: 'Class' },
  _teacher: [{ type: Schema.ObjectId, ref: 'User' }],
  _parent: [{ type: Schema.ObjectId, ref: 'User' }],
  active: Boolean
});

module.exports = mongoose.model('Group', GroupSchema);