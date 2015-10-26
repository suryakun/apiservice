'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    _user: { type: Schema.ObjectId, ref: 'User' },
    _story: { type: Schema.ObjectId, ref: 'Story' },
    url: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});

PhotoSchema.pre('save', function (done) {
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    done();
});

PhotoSchema.statics.getStoryByPhotoId = function (id, callback) {
  return this.findOne({_id: id, active: true}).populate("_story").exec(callback);
}

module.exports = mongoose.model('Photo', PhotoSchema);