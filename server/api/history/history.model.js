'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HistorySchema = new Schema({
  _student: { type: Schema.ObjectId, ref: 'Student' },
  info: String,
  old_class: String,
  new_class: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
});

HistorySchema.pre('save', function (done) {
	var now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('History', HistorySchema);