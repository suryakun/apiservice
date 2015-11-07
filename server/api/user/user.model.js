'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var authTypes = ['github', 'twitter', 'facebook', 'google'];
var Classd = require('../class/class.model');
var Story = require('../story/story.model');
var School = require('../school/school.model');
var Reply = require('../reply/reply.model');
var Photo = require('../photo/photo.model');
var _ = require('lodash');

var UserSchema = new Schema({
    _parent: { type: Schema.ObjectId, ref: 'User' },
    _class: { type: Schema.ObjectId, ref: 'Class' },
    _school: { type: Schema.ObjectId, ref: 'School' },
    _story: [{ type: Schema.ObjectId, ref: 'Story' }],
    _student: [{ type: Schema.ObjectId, ref: 'User' }],
    _reply: [{ type: Schema.ObjectId, ref: 'Reply' }],
    username: String,
    name: String,
    email: { type: String, lowercase: true },
    avatar: String,
    gcm_id: String,
    ios_id: String,
    role: {
        type: String,
        default: 'user'
    },
    hashedPassword: String,
    provider: String,
    salt: String,
    facebook: {},
    twitter: {},
    google: {},
    github: {},
    createdAt: Date,
    updatedAt: Date
});

UserSchema.pre('save', function (done) {
    var now = new Date();
    this.updatedAt = now;
    if ( !this.createdAt ) {
        this.createdAt = now;
    }
    done(); 
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function() {
        return {
            'name': this.name,
            'avatar': this.avatar || '',
            'role': this.role,
            '_student': this._student,
            '_parent': this._parent,
            '_class': this._class
        };
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function(email) {
        if (authTypes.indexOf(this.provider) !== -1) return true;
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
        if (authTypes.indexOf(this.provider) !== -1) return true;
        return hashedPassword.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({email: value}, function(err, user) {
            if(err) throw err;
            if(user) {
                if(self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

UserSchema.statics.getReplyByUserId = function (id, callback) {
        return this.findOne({_id: id}).populate("_reply").exec(callback);
}

UserSchema.statics.getStudentByParentId = function (id, callback) {
        return this.findOne({_id: id}).populate("_student").exec(callback);
}

UserSchema.statics.getStoryByTeacherId = function (id, callback) {
        return this.findOne({_id: id}).populate("_story").exec(callback);
}

UserSchema.statics.getStudentsFromMySchool = function (id, callback) {
    return this.findOne({_id: id}).populate("_class").exec(function (err, docs) {
        Classd.populate(docs, {
            path : '_class._student',
            select : 'name email',
            model: usr
        }, callback);
    });
}

UserSchema.statics.getStoriesForParent = function (id, callback) {
    var usr = this;
    return usr.findById(id).populate('_story').exec(function (err, story) {
        Story.populate(story, {
                path: "_story._reply",
                select: "info _parent",
                model: Reply
        }, function (err, popstory) {
                Story.populate(story, {
                        path: "_story._photo",
                        select: "url",
                        model: Photo
                },callback);
        });
    });
}

UserSchema.statics.getStoriesForTeacher = function (id, callback) {
    return this.findById(id).populate('_story').exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                        Story.populate(story, {
                                path: "_story._photo",
                                select: "url",
                                model: Photo
                        },callback);
                });
    });
}


UserSchema.statics.getStoriesForParentByDate = function (id, date, callback) {
    var usr = this;
    return usr.find({_id: id, createdAt: {$gt: date}}).populate('_student').exec(function (err, std) {
        if (err) { callback(err, null); };
        var tmp_id = [];
        _.each(std, function (student, index) {
            _.each(student._student, function (stdstory, index) {
                tmp_id.push(stdstory._class);
            });
        });
        
        if (tmp_id.length == 0) callback(null, null);
        Classd.findById(tmp_id[0]).populate('_story', null, {createdAt: {$gt: date}}).exec(function (err, data) {
            if (err) { callback(err, null); };
            console.log(data);
            Classd.populate(data, {
                path: '_story._reply',
                select: 'info _parent createdAt',
                model: Reply
            }, callback);
        });

    });
}
        

UserSchema.statics.getStoriesForTeacherByDate = function (id, date, callback) {
    return this.findById(id).populate('_story', null, {createdAt: {$gt: date}} ).exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                        Story.populate(popstory, {
                                path: "_story._photo",
                                select: "url",
                                model: Photo
                        }, callback);
                });
    });
}

UserSchema.statics.getClassForTeacher = function (id, callback) {
    return this.findById(id).populate("_class").exec(function (err, cls) {
        Classd.populate(cls, {
            path: "_class._school",
            model: School
        }, callback);
    });
}

UserSchema.statics.getClassForParent = function (id, callback) {
    var user = this;
    return user.findById(id).populate("_student").exec(function (err, student) {
            user.populate(student, {
                path: "_student._class",
                model: Classd
            }, function (err, cls) {
                Classd.populate(cls, {
                    path: "_student._class._school",
                    model: School
                }, callback);
            });
    });
}

UserSchema.statics.getParentForTeacher = function (id, callback) {
    var user = this;
    return user.findById(id).exec(function (err, me) {
        user.find({_school : me._school, role : 'student'}).populate("_parent").exec(callback);
    });
}

UserSchema.statics.updateGcmId = function (id, gcm_id, callback) {
    var user = this;
    return user.findById(id).exec(function (err, me) {
        me.gcm_id = gcm_id;
        me.save();
    });
}

UserSchema.statics.getAllPrincipal = function (callback) {
    return this.find({role: 'principal'}).exec(callback);
}

module.exports = mongoose.model('User', UserSchema);
