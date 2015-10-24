'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ParentSchema = new Schema({
	_student: [{ type: Schema.ObjectId, ref: 'Student' }],
  name: String,
  address: String,
  phone: String,
  active: Boolean,
	createdAt: Date,
  updatedAt: Date
});

ParentSchema.pre('save', function (done) {
	now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('Parent', ParentSchema);