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

function initialFolderUpload (argument) {
}

// Creates a new story in the DB.
exports.create = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {

        if (fields.type == 'info') {
            var gcm_ids = [];
            var ios_ids = [];
            var dataDescription = {};

            doCreateStory(function () {
                console.log(dataDescription);
                console.log(gcm_ids);
                console.log(ios_ids);
            });

            function doCreateStory(fnCallback) {
                async.series([
                    function (callback) {
                        dataDescription._teacher = mongoose.Types.ObjectId(req.user._id);
                        dataDescription.info = fields.info;
                        dataDescription.type = fields.type;
                        dataDescription.active = true;
                        dataDescription._class = mongoose.Types.ObjectId(fields.class_id);
                        dataDescription._parent = [];
                        callback();
                    }
                ], [
                    function (callback) {
                        Classd.findById(dataDescription._class).populate("_student").exec(function (err, destClass) {
                            // console.log(destClass);
                            User.populate(destClass._student, {
                                path: '_parent',
                                select: 'name gcm_id ios_id',
                                model: User
                            }, callback);
                        });
                    }
                ], [
                    function (err, parents, callback) {
                        _.each(parents, function (parent, index) {
                            if (parent._parent) {
                                dataDescription._parent.push(mongoose.Types.ObjectId(parent._parent._id));
                                gcm_ids.push(parent._parent.gcm_id);
                                ios_ids.push(parent._parent.ios_id);
                            };
                        });
                        callback();
                    }
                ]);
            }            

            // Story.create(dataDescription, function (err, story) {
            //     var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id);
            //     var uniqid = Date.now();
            //     var idfile = [];
            //     var filename = [];

            //     mkdirp(pathfile, function(err) {
            //         if(err) { return handleError(res, err); }
            //     });

            //     _.each(files, function (file, index) {
            //         var name = uniqid + file.name;
            //         var targetfile = pathfile + '/' + name;
            //         fs.rename(file.path, targetfile);
            //         filename.push({ url: story._id + '/' + name});
            //         story._photo.push({ url: story._id + '/' + name});
            //     });





                
                
            // })
            
        };
    });
    //move file to uploader path    







































    //     Story.create({
    //         info: fields.info,
    //         type: fields.type,
    //         active: true,
    //     }, function (err, story) {
            
    //         var filename = [];
    //         var idfile = [];
    //         var uniqid = Date.now();
    //         //move file to uploader path    
    //         _.each(files, function (file, index) {
    //             var name = uniqid + file.name;
    //             var targetfile = pathfile + '/' + name;
    //             fs.rename(file.path, targetfile);
    //             filename.push({ url: story._id + '/' + name});
    //         });

    //         var me = req.user;
    //         var receiver_ids = [];
    //         var classes = [];
            
    //         function saveFieldToStory(str, fields, res, filename) {
    //             var class_id = fields.class_id.split(",");
    //             if (fields.type == 'info') {
    //                 for (var i = 0, c = class_id.length ; i < c; i++) {
    //                     Story._class.push(mongoose.Types.ObjectId(class_id[i]));
    //                     classes.push(mongoose.Types.ObjectId(class_id[i]));
    //                 };
                    
    //                 Classd.find({ _id : {$in: classes }}).populate("_student").exec(function (err, dataclass) {
    //                     _.each(dataclass, function (classe, index) {
    //                         _.each(classe._student, function (studentData, index) {
    //                             if (studentData._parent) {
    //                                 receiver_ids.push(studentData._parent);
    //                             };
    //                         });
    //                     });
    //                 });

    //             } else {
    //                 var parent = fields.parent.split(",");
    //                 for (var j = 0, p = parent.length ; j < parent; j++) {
    //                     Story._parent.push(mongoose.Types.ObjectId(parent[j]));
    //                 };
    //             }
                
    //             Story.save(function (err) {
    //                 User.findById(me._id).exec(function (err, teacher) {
    //                     if(err) { return handleError(res, err); }
    //                     if(!teacher) { return res.status(404).send('Not Found Teacher'); }
    //                     teacher._story.push(str._id);
    //                     teacher.save(function (err) {
    //                         var gcm_ids = [];
    //                         if(err) { return handleError(res, err); }
    //                         User.find({ _id: {$in : receiver_ids }}, "name").exec(function (err, gcmData) {
    //                             _.each(gcmData, function (gcm, index) {
    //                                 if (gcm.gcm_id) {
    //                                     gcm_ids.push(gcm.gcm_id);
    //                                 };
    //                             })
    //                             if (gcm_ids.length > 0) {
    //                                 Gcm.sendGcm('story', teacher._id, Story._id, gcm_ids);
    //                             };
    //                             res.status(201).send({message: 'ok'}); 
    //                         });
    //                     });
    //                 });
    //             });
    //         }

    //         if (filename.length > 0) {
    //             console.log(filename);
    //             Photo.create(filename, function (err, photo) {
    //                 _.each(photo, function (docs, index) {
    //                     Story._photo.push(mongoose.Types.ObjectId(docs._id));
    //                 });
    //                 saveFieldToStory(Story, fields, res, filename);
    //             });
    //         } else { 
    //             saveFieldToStory(Story, fields, res, filename);
    //         }

    //     });
    // });
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