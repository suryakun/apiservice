'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var helper = require('../../config/helpers');
var jwt = require('jsonwebtoken');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');

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
    newUser.role = 'user';
    newUser.save(function(err, user) {
        if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });
    });
};

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
    })
    form.parse(req, function(err, fields, files) {

        if (!isEmptyObject(fields)) {
            User.update({'_id': req.user._id}, {$set: {name: fields.username }}, {multi:false}, function (err, ok) {
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
            res.status(200).json(data);
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
        // var parent = user.map(function (p) {
        //     return p._parent;
        // });
        res.status(200).json(user);
    });
}

exports.getTeacherOfMySchool = function (req, res) {
    User.getTeacherOfMySchool(req.user._id, function (err, user) {
        var teacher = user.map(function (p) {
            return p._teacher;
        });
        res.status(200).json(teacher[0]);
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
