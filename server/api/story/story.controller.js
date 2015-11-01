// 'use strict';

var _ = require('lodash');
var Story = require('./story.model');
var User = require('../user/user.model');
var Photo = require('../photo/photo.model');
var Teacher = require('../teacher/teacher.model');
var Classd = require('../class/class.model');
var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var queue = require('queue');
var q = queue();
var Thing = require('../thing/thing.controller');
var Gcm = Thing.sendGcm;
var async = require('async');

// Get list of storys
exports.index = function(req, res) {
    Story.find({ active: true}, function (err, storys) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(storys);
    });
};

// Get a single story
exports.show = function(req, res) {
    Story.find({_id: req.params.id, active: true}, function (err, story) {
        if(err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        if(!story) { return res.status(404).send('Not Found'); }
        return res.json(story);
    });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {

        if (fields.type == 'info') {
            if (req.user.role == 'parent') { return res.status(401).send('parent cannot create info Story'); };
            var gcm_ids = [];
            var ios_ids = [];
            var dataDescription = {};
            var filename = [];
            var uniqid = Date.now();

            dataDescription._teacher = mongoose.Types.ObjectId(req.user._id);
            dataDescription.info = fields.info;
            dataDescription.type = fields.type;
            dataDescription.active = true;
            dataDescription._class = mongoose.Types.ObjectId(fields.class_id);
            dataDescription._parent = [];
            dataDescription._photo = [];

            Classd.findById(dataDescription._class).populate("_student").exec(function (err, destClass) {
                // console.log(destClass);
                User.populate(destClass._student, {
                    path: '_parent',
                    select: 'name gcm_id ios_id',
                    model: User
                }, function (err, parents) {
                    _.each(parents, function (parent, index) {
                        if (parent._parent) {
                            dataDescription._parent.push(mongoose.Types.ObjectId(parent._parent._id));
                            if (parent._parent.gcm_id) gcm_ids.push(parent._parent.gcm_id);
                            if (parent._parent.ios_id) ios_ids.push(parent._parent.ios_id);
                        };
                    });
                    
                    Story.create(dataDescription, function (err, story) {
                        var Filekeys = Object.keys(files);
                        if (Filekeys.length > 0) {
                            _.each(Filekeys, function (file, index) {
                                var name = uniqid + files[file]['name'];
                                var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id);
                                var targetfile = pathfile + '/' + name;
                                // console.log(files[file]);
                                // return false;
                                mkdirp(pathfile, function(err) {
                                    if(err) { return handleError(res, err); }
                                });

                                fs.rename(files[file]['path'], targetfile);
                                filename.push({ url: story._id + '/' + name});
                            });

                            Photo.create(filename, function (err, photos) {
                                _.each(photos, function (photo, index) {
                                    story._photo.push(photo._id);
                                    story.save();

                                    Photo.findOne(photo, function (err, pho) {
                                        pho._user = mongoose.Types.ObjectId(req.user._id);
                                        pho._story = story._id;
                                        pho.save();
                                    });
                                });
                            });
                            // res.status(201).json({message: 'ok'});
                        }

                        Classd.findById(fields.class_id, function (err, classd) {
                            if(err) { return handleError(res, err); }
                            if(!classd) { return res.status(404).send('Class Not Found'); }
                            classd._story.push(story._id);
                            classd.save(function (err, cls) {
                                if (gcm_ids.length > 0) Thing.sendGcm('story', req.user._id, story._id, gcm_ids);
                                return res.status(201).json({message: 'ok'});
                            });
                        });

                        User.findById(req.user._id, function (err, teacher) {
                            teacher._story.push(mongoose.Types.ObjectId(story._id));
                            teacher.save();
                        });

                        // console.log(dataDescription._parent);
                        User.update({_id: { $in : dataDescription._parent }}, {$push : {'_story': mongoose.Types.ObjectId(story._id)}}, {multi: true}, function (err, parent) {
                            console.log(parent);
                        });

                    });
                });
            });
        } else {
            var gcm_ids = [];
            var ios_ids = [];
            var dataDescription = {};
            var filename = [];
            var uniqid = Date.now();
            var story_id;

            dataDescription._teacher = mongoose.Types.ObjectId(req.user._id);
            dataDescription.info = fields.info;
            dataDescription.type = fields.type;
            dataDescription.active = true;
            dataDescription._parent = [];
            dataDescription._photo = [];

            var Parents = fields.parent.split(",");
            User.find({_id : { $in : Parents }}, function (err, parents) {
                _.each(parents, function (parent, index) {
                    Story.create(dataDescription, function (err, story) {
                        story._parent.push(parent._id);
                        var Filekeys = Object.keys(files);
                        if (Filekeys.length > 0) {
                            _.each(Filekeys, function (file, index) {
                                var name = uniqid + files[file]['name'];
                                var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id);
                                var targetfile = pathfile + '/' + name;
                                
                                mkdirp(pathfile, function(err) {
                                    if(err) { return handleError(res, err); }
                                });

                                fs.rename(files[file]['path'], targetfile);
                                filename.push({ url: story._id + '/' + name});
                            });

                            Photo.create(filename, function (err, photos) {
                                _.each(photos, function (photo, index) {
                                    story._photo.push(photo._id);
                                    story.save();

                                    Photo.findOne(photo, function (err, pho) {
                                        pho._user = mongoose.Types.ObjectId(req.user._id);
                                        pho._story = story._id;
                                        pho.save();
                                    });
                                });
                            });
                        };

                        User.findById(req.user._id, function (err, teacher) {
                            teacher._story.push(mongoose.Types.ObjectId(story._id));
                            teacher.save();
                        });
                        
                        User.findOne(parent, function (err, p) {
                            p._story.push(story._id);
                            p.save(function (err, pgcm) {
                                if (pgcm.gcm_id) gcm_ids.push(pgcm.gcm_id);
                                if (gcm_ids.length > 0) Thing.sendGcm('story', req.user._id, story._id, gcm_ids);
                                return res.status(201).json({message: 'ok'});
                            });
                        });

                    });
                });
            });

        };
    });
}

// Updates an existing story in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Story.find({_id: req.params.id, active: true}, function (err, story) {
        if (err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        var updated = _.merge(story, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(story);
        });
    });
};

// Deletes a story from the DB.
exports.destroy = function(req, res) {
    Story.find({_id: req.params.id, active: true}, function (err, story) {
        if(err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        story.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

exports.getReplyByStoryId = function (req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getReplyByStoryId(story_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data._reply);
    });
}

exports.getParentByStoryId = function (req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getParentByStoryId(story_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.getPhotoByStoryId = function (req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getPhotoByStoryId(story_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.getClassByStoryId = function (req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getClassByStoryId(story_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

exports.getTeacherByStoryId = function (req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getTeacherByStoryId(story_id, function (err, data) {
        if(err) { return handleError(res, err); }
        if(!data) { return res.status(404).send('Not Found'); }
        res.status(200).json(data);
    });
}

function handleString(res, string) {
    var type = typeof string;
    if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

function handleError(res, err) {
    return res.status(500).send(err);
}