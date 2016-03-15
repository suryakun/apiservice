'use strict';

var User = require('./user.model');
var Classd = require('../class/class.model');
var passport = require('passport');
var config = require('../../config/environment');
var helper = require('../../config/helpers');
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');

var validationError = function(res, err) {
    return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
    User.find({active: true}, '-salt -hashedPassword', function (err, users) {
        if(err) return res.status(500).send(err);
        res.status(200).json(users);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });
    });
};

/*
update user
*/
exports.update = function(req, res) {
    User.update({_id:req.body._id}, {$set:{name:req.body.name}}, function (err, user) {
        if (err || !user) { return handleError(res, err); }
        User.update({_id:req.body._student[0]._id}, {$set:{name:req.body._student[0].name}}, function (err, userStd) {
            if (err || !userStd) { return handleError(res, err); }
            return res.status(200).json(userStd);
        });
    });
};

/*
update teacher
*/
exports.updateTeacher = function (req, res) {
    User.update({_id:req.body._id}, {$set:{name:req.body.name}}, function (err, user) {
        if (err || !user) { return handleError(res, err); }
        return res.status(200).json(user);
    });
}

/*
* Create student and parent
*/
exports.createParent = function (req, res, next) {

    User.create([{
        provider: 'local',        
        name: req.body.student.name,
        email: req.body.student.email,
        role: 'student',
        password: req.body.student.password
    }, {
        provider: 'local',        
        name: req.body.parent.name,
        email: req.body.parent.email,
        role: 'parent',
        password: req.body.parent.password
    }] , function (err) {
        if (err) {
            res.status(500).send(err);
        } else {
            setTimeout(function () {
                User.findOne({email: req.body.student.email}, function (err, std) {
                    User.findOne({email: req.body.parent.email}, function (err, prn) {
                        console.log(std);
                        console.log(prn);
                        std._parent = mongoose.Types.ObjectId(prn._id);
                        std.save();

                        prn._student.push(mongoose.Types.ObjectId(std._id));
                        prn.save();
                    });

                    Classd.findById(req.body.class, function (err, cls) {
                        std._class = mongoose.Types.ObjectId(cls._id);
                        std.save();

                        cls._student.push(mongoose.Types.ObjectId(std._id));
                        cls.save(); 
                        res.status(201).send('created');
                    });
                });

            },1000);
        }
    });
}

/*
Create Teacher
*/
exports.createTeacher = function (req, res) {
    Classd.findById(req.body.class, function (err, cls) {
        User.create({
            provider: 'local',        
            name: req.body.name,
            email: req.body.email,
            role: 'teacher',
            password: req.body.password,
            _class: cls._id
        }, function (err, user) {
            Classd.update({_id:req.body.class}, {$push:{_teacher:user.id}}, function (err, ok) {
                res.status(201).send(user.profile);
            });
        })
    });
}

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(req.params.id).populate("_student").populate("_parent").populate("_class").exec(function (err, user) {
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
    console.log(req.params.id);
    User.findByIdAndRemove(req.params.id, function(err, user) {
        if(err) return res.status(500).send(err);
        return res.status(204).send('No Content');
    });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    User.findById(userId, function (err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.status(200).send('OK');
            });
        } else {
            res.status(403).send('Forbidden');
        }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    User.findById(req.user._id, '-salt -hashedPassword').populate("_student").populate("_parent").populate("_class").exec( function(err, user) { 
        if (err) return next(err);
        if (!user) return res.status(401).send('Unauthorized');
        res.json(user.profile);
    });
};

exports.getReplyByUserId = function (req, res) {
    var user_id = req.params.id;
    handleString(res, user_id);
    User.getReplyByUserId(user_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.getStudentByParentId = function (req, res) {
    var user_id = req.params.id;
    handleString(res, user_id);
    User.getStudentByParentId(user_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.getStoryByTeacherId = function (req, res) {
    var user_id = req.params.id;
    handleString(res, user_id);
    User.getStoryByTeacherId(user_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.updateProfile = function (req, res) {
    var form = new formidable.IncomingForm();
    var uniqid = Date.now();
    var pathfile = path.resolve(__dirname, "../../../client/upload/avatar/" + req.user._id);

    function isEmptyObject(obj) {
        return !Object.keys(obj).length;
    }
    
    mkdirp(pathfile, function(err) {
        if(err) { return handleError(res, err); }
    });

    form.parse(req, function(err, fields, files) {
        if (fields.hasOwnProperty("azure")) {
            var optionSet = {name: fields.username, azure: fields.azure };
        } else {
            var optionSet = {name: fields.username};
        }
        
        if (!isEmptyObject(fields)) {
            User.update({'_id': req.user._id}, {$set: optionSet }, {multi:false}, function (err, ok) {
                console.log(ok);
            });
        };

        if (!isEmptyObject(files)) {
            var filename;
            //move file to uploader path    
            _.each(files, function (file, index) {
                var name = uniqid + file.name;
                name = name.replace(/\s/g, '');
                var targetfile = pathfile + '/' + name;
                fs.rename(file.path, targetfile);
                filename = req.user._id + '/' + name;
            });

            User.update({'_id': req.user._id}, {$set: {avatar: filename }}, {multi:false}, function (err, ok) {
                console.log(ok);
            });
        };

        res.status(200).send({
            "message": "ok"
        });
    });
}

exports.getStudentsFromMySchool = function (req, res) {
    var user_id = req.user._id;
    User.getStudentsFromMySchool(user_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data._class._student);
    });
}

exports.getMyStories = function (req, res) {
    var user_id = req.user._id;
    if (req.user.role == 'teacher') {
        User.getStoriesForTeacher(user_id, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data._story);
        });
    } else if (req.user.role == 'parent') {
        User.getStoriesForParent(user_id, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data._story);
        });
    }
}

exports.getStoryFilter = function (req, res) {
    var user_id = req.user._id;
    var params = {};
    if (req.params.type != '0') {
        params["type"] = req.params.type;
    };

    if (req.params.parent != '0') {
        params["_parent"] = {$in:[req.params.parent]};
    };

    if (req.user.role == 'teacher') {
        User.getStoriesForTeacherWithFilter(user_id, params, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data._story);
        });
    } else if (req.user.role == 'parent') {
        User.getStoriesForParentWithFilter(user_id, params, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data._story);
        });
    }
}

exports.getMyStoriesByDate = function (req, res) {
    var user_id = req.user._id;
    var date = new Date(req.body.date);
    if (req.user.role == 'teacher') {
        User.getStoriesForTeacherByDate(user_id, date, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data);
        });
    } else if (req.user.role == 'parent') {
        User.getStoriesForParentByDate(user_id, date, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            res.status(200).json(data._story);
        });
    }
}

exports.getMyClass = function (req, res) {
    var user_id = req.user._id;
    if (req.user.role == 'teacher') {
        User.getClassForTeacher(user_id, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            data = data.toObject();
            delete data._class._story;
            delete data._class._teacher;
            delete data._class._student;
            res.status(200).json(data._class);
        });    
    } else if (req.user.role == 'parent') {
        User.getClassForParent(user_id, function (err, data) {
            if(err) { return handleError(res, err); }
            if(!data) { return res.status(404).send('Not Found'); }
            var d = data['_student'][0]['_class'].toObject();
            delete d._story;
            delete d._teacher;
            delete d._student;
            res.status(200).json(d);
        });
    }
}

exports.updateGcmId = function (req, res) {
    var gcm_id = req.body.gcm_id;
    User.findById(req.user._id, function (err, me) {
        if(err) { return handleError(res, err); }
        if(!me) { return res.status(404).send('Not Found'); }
        me.gcm_id = gcm_id;
        me.save(function (err) {
            if(err) { return handleError(res, err); }
            res.status(200).json({message: 'ok'});
        });
    });
    
}

exports.getAllPrincipal = function (req, res) {
    User.getAllPrincipal(function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.status(404).send('Not Found'); }
        res.status(200).json(user);
    });
}

exports.getAllParentFromMySchool = function (req, res) {
    User.getParentOfMySchool(req.user._id, function (err, user) {
        var parent = _.pluck(user, "_parent");
        res.status(200).json(parent);
    });
}

exports.getParentForAdmin = function (req, res) {
    User.getParentForAdmin(req.params.id, res, function (err, user) {
        res.status(200).json(user);
    });
}

exports.getTeacherOfMySchool = function (req, res) {
    User.getTeacherOfMySchool(req.user._id, function (err, user) {
        console.log(user.length);
        var tmp = [];
        user.forEach(function (p) {
            _.each(p._teacher, function (t) {
                tmp.push(t);
            })
        });
        res.status(200).json(tmp);
    });
}

exports.getTeacherForAdmin = function (req, res) {
    User.getTeacherForAdmin(req.params.id, function (err, teacher) {
        var tmp = [];
        teacher.forEach(function (p) {
            _.each(p._teacher, function (t) {
                tmp.push(t);
            })
        });
        res.status(200).json(tmp);
    });   
}

exports.getModerator = function (req, res) {
    User.getModerator(req.params.id, function (err, mod) {
        if(err) { return handleError(res, err); }
        if(!mod) { return res.status(404).send('Not Found'); }
        res.status(200).json(mod);
    });
}

function handleString(res, string) {
    var type = typeof string;
    if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};
