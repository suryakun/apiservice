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
var Group = require('../group/group.model');
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
    azure: {},
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
            '_id': this._id,
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
                        select: "url thumb",
                        model: Photo
                }, function (err, popstory) {
                    Story.populate(story, {
                        path: "_story._parent",
                        select: "name email avatar role _student",
                        model: usr
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent._student",
                            select: "name email avatar role",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._teacher",
                                select: "name email avatar role",
                                model: usr
                            }, callback);
                        });
                    });
                });
        });
    });
}

UserSchema.statics.getStoriesForTeacher = function (id, callback) {
    var usr = this;
    return this.findById(id).populate('_story', null, {active:true}).exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                            Story.populate(story, {
                            path: "_story._photo",
                            select: "url thumb",
                            model: Photo
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent",
                            select: "name email avatar role _student",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._parent._student",
                                select: "name email avatar role",
                                model: usr
                            }, function (err, popstory) {
                                Story.populate(story, {
                                    path: "_story._teacher",
                                    select: "name email avatar role",
                                    model: usr
                                }, callback);
                            });
                        });
                    });
                });
    });
}


UserSchema.statics.getStoriesForTeacherWithFilter = function (id, params, callback) {
    var usr = this;
    params.active = true;
    return this.findById(id).populate('_story', null, params).exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                            Story.populate(story, {
                            path: "_story._photo",
                            select: "url thumb",
                            model: Photo
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent",
                            select: "name email avatar role _student",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._parent._student",
                                select: "name email avatar role",
                                model: usr
                            }, function (err, popstory) {
                                Story.populate(story, {
                                    path: "_story._teacher",
                                    select: "name email avatar role",
                                    model: usr
                                }, function (err, popstory) {
                                    Story.populate(story, {
                                        path: "_story._class",
                                        select: "name",
                                        model: Classd
                                    }, function (err, popstory) {
                                        Story.populate(story, {
                                            path: "_story._group",
                                            select: "name",
                                            model: Group
                                        }, callback);
                                    });
                                });
                            });
                        });
                    });
                });
    });
}

UserSchema.statics.getStoriesForParentWithFilter = function (id, params, callback) {
    var usr = this;
    params.active = true;
    return usr.findById(id).populate('_story', null, params).exec(function (err, story) {
        Story.populate(story, {
                path: "_story._reply",
                select: "info _parent",
                model: Reply
        }, function (err, popstory) {
                Story.populate(story, {
                        path: "_story._photo",
                        select: "url thumb",
                        model: Photo
                }, function (err, popstory) {
                    Story.populate(story, {
                        path: "_story._parent",
                        select: "name email avatar role _student",
                        model: usr
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent._student",
                            select: "name email avatar role",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._teacher",
                                select: "name email avatar role",
                                model: usr
                            }, callback);
                        });
                    });
                });
        });
    });
}


UserSchema.statics.getStoriesForParentByDate = function (id, date, callback) {
    var usr = this;
    return this.findById(id).populate('_story', null, {createdAt: {$gt: date}, active:true} ).exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                            Story.populate(story, {
                            path: "_story._photo",
                            select: "url thumb",
                            model: Photo
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent",
                            select: "name email avatar role _student",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._parent._student",
                                select: "name email avatar role",
                                model: usr
                            }, function (err, popstory) {
                                Story.populate(story, {
                                    path: "_story._teacher",
                                    select: "name email avatar role",
                                    model: usr
                                }, callback);
                            });
                        });
                    });
                });
    });
}
        

UserSchema.statics.getStoriesForTeacherByDate = function (id, date, callback) {
    var usr = this;
    return this.findById(id).populate('_story', null, {createdAt: {$gt: date}, active:true} ).exec(function (err, story) {
                Story.populate(story, {
                        path: "_story._reply",
                        select: "info _parent",
                        model: Reply
                }, function (err, popstory) {
                            Story.populate(story, {
                            path: "_story._photo",
                            select: "url thumb",
                            model: Photo
                    }, function (err, popstory) {
                        Story.populate(story, {
                            path: "_story._parent",
                            select: "name email avatar role _student",
                            model: usr
                        }, function (err, popstory) {
                            Story.populate(story, {
                                path: "_story._parent._student",
                                select: "name email avatar role",
                                model: usr
                            }, function (err, popstory) {
                                Story.populate(story, {
                                    path: "_story._teacher",
                                    select: "name email avatar role",
                                    model: usr
                                }, callback);
                            });
                        });
                    });
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
        user.find({_class : me._class, role : 'student'}).populate("_parent").exec(callback);
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

UserSchema.statics.getParentOfMySchool = function (id, callback) {
    var user = this;
    return user.findById(id).populate("_class").populate("_student").exec(function (err, me) {
        if (me.role == 'teacher') {
            Classd.findById(me._class).populate("_school").exec(function (err, cls) {
                School.findById(cls._school._id).populate("_class").exec(function (err, c) {
                    Classd.find({_id : {$in: c._class}}).populate("_student").exec(function (err, clas) {
                        var tmp = [];
                        clas.forEach(function (p) {
                            _.each(p._student, function (t) {
                                tmp.push(t);
                            })
                        });
                        var student_ids = _.pluck(tmp, "_id");
                        user.find({_id: {$in: student_ids}}).populate("_parent").exec(callback);
                    });
                });
            });
        };

        if (me.role == 'parent') {
            Classd.findById(me._student[0]._class).populate("_school").exec(function (err, cls) {
                School.findById(cls._school._id).populate("_class").exec(function (err, c) {
                    Classd.find({_id : {$in: c._class}}).populate("_student").exec(function (err, clas) {
                        var tmp = [];
                        clas.forEach(function (p) {
                            _.each(p._student, function (t) {
                                tmp.push(t);
                            })
                        });
                        var student_ids = _.pluck(tmp, "_id");
                        user.find({_id: {$in: student_ids}}).populate("_parent").exec(callback);
                    });
                });
            });
        };
    });
}

UserSchema.statics.getParentForAdmin = function (id, res, callback) {
    var user = this;
    School.findById(id).populate("_class").exec(function (err, c) {
        if (err) res.status(500).send(err);
        if (!c) res.status(404).send('Not Found');
        Classd.find({_id : {$in: c._class}}).populate("_student").exec(function (err, clas) {
            var tmp = [];
            clas.forEach(function (p) {
                _.each(p._student, function (t) {
                    tmp.push(t);
                })
            });
            var student_ids = _.pluck(tmp, "_id");
            user.find({_id: {$in: student_ids}}).populate("_parent").populate("_class").exec(callback);
        });
    });
}

UserSchema.statics.getTeacherOfMySchool = function (id, callback) {
    var user = this;
    return user.findById(id).populate("_class").populate("_student").exec(function (err, me) {
        if (me.role == 'teacher') {
            Classd.findById(me._class).populate("_school").exec(function (err, cls) {
                School.findById(cls._school._id).populate("_class").exec(function (err, c) {
                    Classd.find({_id : {$in: c._class}}).populate("_teacher").exec(callback);
                });
            });
        };

        if (me.role == 'parent') {
            Classd.findById(me._student[0]._class).populate("_school").exec(function (err, cls) {
                School.findById(cls._school._id).populate("_class").exec(function (err, c) {
                    Classd.find({_id : {$in: c._class}}).populate("_teacher").exec(callback);
                });
            });
        };

    });
}

UserSchema.statics.getTeacherForAdmin = function (id, callback) {
    var user = this;
    School.findById(id).populate("_class").exec(function (err, c) {
        Classd.find({_id : {$in: c._class}}).populate("_teacher").exec(function (err, teacher) {
            user.populate(teacher, {
                path: "_teacher._class",
                select: "name",
                model: Classd
            }, callback);
        });
    });
}

UserSchema.statics.findByIdAndRemove = function (id, callback) {
    var user = this;
    // user.update({_id:id}, {$set: {'active': false}}, callback);
    user.remove({_id:id}, callback);
}

UserSchema.statics.getModerator = function (id, callback) {
    return this.find({role: 'moderator', _school:id}).exec(callback);
}

module.exports = mongoose.model('User', UserSchema);
