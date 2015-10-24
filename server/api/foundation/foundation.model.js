'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoundationSchema = new Schema({
	_school: [{ type: Schema.ObjectId, ref: 'School' }],
  name: String,
  address: String,
  phone: String,
  owner: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
});

FoundationSchema.statics.getAllSchoolById = function (id, callback) {    
  return this.findById(id).populate('_school').exec(callback);
};

FoundationSchema.pre('save', function (done) {
	var now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('Foundation', FoundationSchema);