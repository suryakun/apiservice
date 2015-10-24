'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StudentSchema = new Schema({
	_parent: [{ type: Schema.ObjectId, ref: 'Parent' }],
	_class: { type: Schema.ObjectId, ref: 'Class' },
  name: String,
  phone: String,
  active: Boolean,
	createdAt: Date,
  updatedAt: Date
});

StudentSchema.pre('save', function (done) {
	now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('Student', StudentSchema);