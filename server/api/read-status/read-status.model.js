'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReadStatusSchema = new Schema({
  _story: { type: Schema.ObjectId, ref: 'Story' },
  _parent: { type: Schema.ObjectId, ref: 'Parent' },
  status: Boolean,
  active: Boolean,
	createdAt: Date,
  updatedAt: Date
});

ReadStatusSchema.pre('save', function (done) {
	var now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('ReadStatus', ReadStatusSchema);