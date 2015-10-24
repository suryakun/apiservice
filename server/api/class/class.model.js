'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ClassSchema = new Schema({
    _school: { type: Schema.ObjectId, ref: 'School' },
    _level: { type: Schema.ObjectId, ref: 'Level' },
    _student: [{ type: Schema.ObjectId, ref: 'User' }],
    _teacher: [{ type: Schema.ObjectId, ref: 'User' }],
    _story: [{ type: Schema.ObjectId, ref: 'Story' }],
    name: String,
    info: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});

ClassSchema.pre('save', function (done) {
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    done();
});

ClassSchema.statics.getAllStudentByClassId = function (id, callback) {
    return this.findOne({ _id: id}).populate("_student").exec(callback);
}

ClassSchema.statics.getSchoolByClassId = function (id, callback) {
    return this.findOne({ _id: id}).populate("_school").exec(callback);
}

ClassSchema.statics.getLevelByClassId = function (id, callback) {
    return this.findOne({ _id: id}).populate("_level").exec(callback);
}

module.exports = mongoose.model('Class', ClassSchema);