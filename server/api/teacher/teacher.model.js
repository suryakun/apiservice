'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeacherSchema = new Schema({
	_school: { type: Schema.ObjectId, ref: 'School' },
	_story: [{ type: Schema.ObjectId, ref: 'Story' }],
  name: String,
  info: String,
  active: Boolean,
createdAt: Date,
  updatedAt: Date
});

TeacherSchema.pre('save', function (done) {
	now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('Teacher', TeacherSchema);