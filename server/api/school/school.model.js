'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var SchoolSchema = new Schema({
    _foundation: { type: Schema.ObjectId, ref: 'Foundation' },
    _class: [{ type: Schema.ObjectId, ref: 'School' }],
    _teacher: [{ type: Schema.ObjectId, ref: 'User' }],
    address: String,
    phone: String,
    principal: String,
    name: String,
    info: String,
    active: Boolean,
    createdAt: Date,
    updatedAt: Date
});

SchoolSchema.pre('save', function (done) {
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    done(); 
});

SchoolSchema.statics.getFoundationBySchoolId = function (id, callback) {
    return this.findOne({ _id: id}).populate("_foundation").exec(callback);
}

SchoolSchema.statics.getClassBySchoolId = function (id, callback) {
    return this.findOne({ _id: id}).populate("_class").exec(callback);
}

module.exports = mongoose.model('School', SchoolSchema);