'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LevelSchema = new Schema({
  _class: [{ type: Schema.ObjectId, ref: 'Class' }],
  grade: String,
  info: String,
  active: Boolean,
  createdAt: Date,
  updatedAt: Date
});

LevelSchema.pre('save', function (done) {
	var now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

LevelSchema.statics.getClassByLevelId = function (id, callback) {
  return this.findOne({_id: id}).populate("_class").exec(callback);
}

module.exports = mongoose.model('Level', LevelSchema);