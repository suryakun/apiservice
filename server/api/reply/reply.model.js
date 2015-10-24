'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReplySchema = new Schema({
	_story: { type: Schema.ObjectId, ref: 'Story' },
	_parent: { type: Schema.ObjectId, ref: 'User' },
	_teacher: { type: Schema.ObjectId, ref: 'User' },
	info: String,
	active: Boolean,
	createdAt: Date,
	updatedAt: Date
});

ReplySchema.pre('save', function (done) {
	var now = new Date();
	this.updatedAt = now;
	if ( !this.createdAt ) {
		this.createdAt = now;
	}
	done();
});

module.exports = mongoose.model('Reply', ReplySchema);