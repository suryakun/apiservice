'use strict';

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
        return res.json(story);
    });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {

        Story.create({
            info: fields.info,
            type: fields.type,
            active: true,
        }, function (err, story) {
            var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id);
            mkdirp(pathfile, function(err) {
                if(err) { return handleError(res, err); }
            });
            
            var filename = [];
            var idfile = [];
            var uniqid = Date.now();
            //move file to uploader path    
            _.each(files, function (file, index) {
                var name = uniqid + file.name;
                var targetfile = pathfile + '/' + name;
                fs.rename(file.path, targetfile);
                filename.push({ url: story._id + '/' + name});
            });

            Story.findById(story._id, function (err, str) {
                var me = req.user;
                function save(str, fields, res, filename) {
                    if(err) { return handleError(res, err); }
                    if(!str) { return res.status(404).send('Not Found'); }
                    var class_id = fields.class_id.split(",");
                    if (fields.type == 'info') {
                        for (var i = 0, c = class_id.length ; i < c; i++) {
                            str._class.push(mongoose.Types.ObjectId(class_id[i]));
                        };
                    } else {
                        var parent = fields.parent.split(",");
                        for (var j = 0, p = parent.length ; j < parent; j++) {
                            str._parent.push(mongoose.Types.ObjectId(parent[j]));
                        };
                    }
                    str.save(function (err) {
                        User.findById(me._id).exec(function (err, teacher) {
                            if(err) { return handleError(res, err); }
                            if(!teacher) { return res.status(404).send('Not Found Teacher'); }
                            teacher._story.push(str._id);
                            teacher.save();
                            res.status(201).send({message: 'ok'}); 
                        });
                    });
                }

                if (filename.length > 0) {
                    Photo.create(filename, function (err, photo) {
                        _.each(photo, function (docs, index) {
                            str._photo.push(mongoose.Types.ObjectId(docs._id));
                        });
                        save(str, fields, res, filename);
                    });
                } else { 
                    save(str, fields, res, filename);
                }
            });

        });
    });
};

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