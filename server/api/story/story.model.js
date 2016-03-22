'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Classd = require('../class/class.model');
var User = require('../user/user.model');
var _ = require('lodash');

var StorySchema = new Schema({
    _teacher: { type: Schema.ObjectId, ref: 'User' },
    _group: [{ type: Schema.ObjectId, ref: 'User' }],
    _photo: [{ type: Schema.ObjectId, ref: 'Photo' }],
    _parent: [{ type: Schema.ObjectId, ref: 'User' }],
    _class: [{ type: Schema.ObjectId, ref: 'Class' }],
    _reply: [{ type: Schema.ObjectId, ref: 'Reply' }],
    _readed: [{ type: Schema.ObjectId, ref: 'User' }],
    _cc: [{ type: Schema.ObjectId, ref: 'User' }],
    calendar: {},
    name: String,
    info: String,
    type: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});

StorySchema.pre('save', function (done) {
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    done();
});

StorySchema.statics.getReplyByStoryId = function (id, callback) {
  return this.findById(id).populate("_reply").exec(callback);
}

StorySchema.statics.getParentByStoryId = function (id, callback) {
  return this.findOne({_id: id, active: true}).populate("_parent").exec(callback);
}

StorySchema.statics.getPhotoByStoryId = function (id, callback) {
  return this.findOne({_id: id, active: true}).populate("_photo").exec(callback);
}

StorySchema.statics.getClassByStoryId = function (id, callback) {
  return this.findOne({_id: id, active: true}).populate("_class").exec(callback);
}

StorySchema.statics.getTeacherByStoryId = function (id, callback) {
  return this.findOne({_id: id, active: true}).populate("_teacher").exec(callback);
}

StorySchema.statics.readStory = function (story_id, user_id, callback) {
  return this.update({_id: story_id}, {$push : {'_readed': mongoose.Types.ObjectId(user_id)}}, {multi: false}, callback);
}

StorySchema.statics.getReader = function (story_id, callback) {
  return this.findById(story_id).populate("_readed").exec(callback);
}

StorySchema.statics.getInfoBySchool = function (school_id, callback) {
  return Classd.find({_school: school_id}, "name _story").populate("_story", "info createdAt calendar", {type:"info"}).exec(callback);
}

StorySchema.statics.getInfoByUser = function (user_id, callback) {
  var Userd = require('../user/user.model');
  return Userd.findById(user_id, "name _story").populate("_story", "info createdAt calendar", {type:"info"}).exec(callback);
}

module.exports = mongoose.model('Story', StorySchema);