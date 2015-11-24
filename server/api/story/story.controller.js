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
var fsx = require('fs-extra');
var _ = require('lodash');
var mkdirp = require('mkdirp');
var queue = require('queue');
var q = queue();
var async = require('async');
var gcm = require('android-gcm');
var gcmObject = new gcm.AndroidGcm('AIzaSyBpjxJEYkAfLMhEWBq2ger2_0EV60VtdW4');
var im = require('imagemagick');

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
                if (err) console.log(err);
                if (!destClass) {
                    console.log("not found")
                    return false;
                };
                console.log(destClass);
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
                                var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id + "/original");
                                var paththumb = path.resolve(__dirname, "../../../client/upload/story/" + story._id + "/thumb");
                                var targetthumb = paththumb + '/' + name;
                                var targetfile = pathfile + '/' + name;
                                
                                mkdirp(pathfile, function(err) {
                                    if(err) { return handleError(res, err); }
                                    fs.rename(files[file]['path'], targetfile);

                                    mkdirp(paththumb, function(err) {
                                        if(err) { return handleError(res, err); }
                                        resizeThumb(targetfile,targetthumb);
                                    });
                                });

                                filename.push({ url: story._id + '/original/' + name, thumb: story._id + '/thumb/' + name });
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

                        var Cc;
                        if (fields.hasOwnProperty('group') && fields.group.length > 0) { 
                            Cc = fields.group.split(","); 
                            if (Cc.length > 0) {
                                User.update({ _id : { $in : Cc}}, {$push : { _story : story._id }}, {multi: true}, function (err, ok) {
                                    if (err) console.log(err);
                                    console.log(ok);
                                });
                                story._cc = Cc.slice();
                                story.save();
                            };
                            User.find({_id : {$in: Cc}}).exec(function (err, cc_user) {
                                var cc_ids = _.pluck(cc_user, 'gcm_id');
                                sendGCM (cc_ids, 'story', req.user._id, story._id);
                            })
                        };


                        Classd.findById(fields.class_id, function (err, classd) {
                            if(err) { return handleError(res, err); }
                            if(!classd) { return res.status(404).send('Class Not Found'); }
                            classd._story.push(story._id);
                            classd.save(function (err, cls) {
                                sendGCM (gcm_ids, 'story', req.user._id, story._id);
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
            var uniqid = Date.now();
            var story_id;

            var Parents = fields.parent.split(",");
            User.findById(req.user._id).exec(function (err, user) {
                User.find({_id : { $in : Parents }}, function (err, parents) {

                    _.each(parents, function (parent, index) {

                        dataDescription._teacher = mongoose.Types.ObjectId(req.user._id);
                        dataDescription.info = fields.info;
                        dataDescription.type = fields.type;
                        dataDescription.active = true;
                        dataDescription._parent = [];
                        dataDescription._photo = [];

                        var filename = [];
                        Story.create(dataDescription, function (err, story) {
                            console.log(story);
                            
                            Story.update({_id: story._id}, {$push: {_parent: parent._id}}, {multi:false}, function (err, ok) {
                                if (err) console.log(err);
                                console.log(ok);
                            });
                            
                            var Filekeys = Object.keys(files);
                            if (Filekeys.length > 0) {
                                _.each(Filekeys, function (file, index) {
                                    var name = uniqid + files[file]['name'];
                                    var pathfile = path.resolve(__dirname, "../../../client/upload/story/" + story._id + "/original");
                                    var paththumb = path.resolve(__dirname, "../../../client/upload/story/" + story._id + "/thumb");
                                    var targetthumb = paththumb + '/' + name;
                                    var targetfile = pathfile + '/' + name;
                                    
                                    mkdirp(pathfile, function(err) {
                                        if(err) { return handleError(res, err); }
                                        fsx.copySync(files[file]['path'], targetfile);

                                        mkdirp(paththumb, function(err) {
                                            if(err) { return handleError(res, err); }
                                            resizeThumb(targetfile,targetthumb);
                                        });
                                    });

                                    filename.push({ url: story._id + '/original/' + name, thumb: story._id + '/thumb/' + name });
                                });

                                Photo.create(filename, function (err, photos) {
                                    _.each(photos, function (photo, index) {
                                        Story.update({_id: story._id}, {$push: {_photo:photo._id}}, {multi:false}, function (err, ok) {
                                            console.log(ok);
                                        });
                                        
                                        Photo.findOne(photo, function (err, pho) {
                                            pho._user = mongoose.Types.ObjectId(req.user._id);
                                            pho._story = story._id;
                                            pho.save();
                                        });
                                    });
                                });
                            }

                            var Cc;
                            if (fields.hasOwnProperty('cc') && fields.cc.length > 0) { 
                                Cc = fields.cc.split(","); 
                                if (Cc.length > 0) {
                                    console.log(Cc);
                                    User.update({ _id : { $in : Cc}}, {$push : { _story : story._id }}, {multi: true}, function (err, ok) {
                                        if (err) console.log(err);
                                        console.log(ok);
                                    });

                                    story._cc = Cc.slice();
                                    story.save();

                                    User.find({_id : {$in: Cc}}).exec(function (err, cc_user) {
                                        var cc_ids = _.pluck(cc_user, 'gcm_id');
                                        sendGCM (cc_ids, 'story', req.user._id, story._id);
                                    })
                                };
                            };

                            user._story.push(mongoose.Types.ObjectId(story._id));
                            user.save();
                            
                            User.findById(parent._id, function (err, p) {
                                p._story.push(story._id);
                                p.save(function (err, pgcm) {
                                    var t = [];                                    
                                    t.push(pgcm.gcm_id);
                                    sendGCM (t, 'story', req.user._id, story._id);
                                });
                            });

                        });
                    });
                    return res.send({message: 'ok'});
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

exports.readStory = function (req, res) {
    Story.readStory(req.body.story_id, req.body.user_id, function (err, reader) {
        if(err) { return handleError(res, err); }
        if(!reader) { return res.status(404).send('Not Found'); }
        res.status(200).json({message: 'ok'}); 
    });
}

exports.getReader = function (req, res) {
    Story.getReader(req.params.id, function (err, reader) {
        if(err) { return handleError(res, err); }
        if(!reader) { return res.status(404).send('Not Found'); }
        res.status(200).json(reader); 
    });    
}

function handleString(res, string) {
    var type = typeof string;
    if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

function handleError(res, err) {
    return res.status(500).send(err);
}

function sendGCM (gcm_ids, type, sender, story_id) {
    var message = new gcm.Message({
        // registration_ids: ['dtevnxDNUVk:APA91bHe1eVij45sYak0sdFPq24oF65kgcrIiiDlW3OkCfb0Yd4J-B6CdBtj5eLh5TyD5PaGt6TzzkdRQD8HQVfdjN3HTZOzhH05UVcOF9db2P9-IE8ByeNeME-0xhXbsZr7V5M5EjjU'],
        registration_ids: gcm_ids,
        data: {
            type: type,
            sender: sender,
            story_id: story_id
        }
    });

    // send the message 
    gcmObject.send(message, function(err, response) {
        if (err) { console.log(err) };
        console.log(response);
    });
}

function resizeThumb (url, destPath) {
    im.identify(url, function(err, file){
        if (err) throw err;
        var maxWidth = 750; // Max width for the image
        var maxHeight = 750;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        var width = file.width;    // Current image width
        var height = file.height;  // Current image height
        var resizeWidth, resizeHeight;

        // Check if the current width is larger than the max
        if(width > maxWidth){
            ratio = maxWidth / width;   // get ratio for scaling image
            resizeWidth = maxWidth; // Set new width
            resizeHeight = height * ratio;  // Scale height based on ratio
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if(height > maxHeight){
            ratio = maxHeight / height; // get ratio for scaling image
            resizeHeight = maxHeight;   // Set new height
            resizeWidth = width * ratio; // Scale width based on ratio
            width = width * ratio;    // Reset width to match scaled image
            height = height * ratio;    // Reset height to match scaled image
        }

        im.resize({
            srcPath: url,
            dstPath: destPath,
            width: resizeWidth,
            height: resizeHeight,
            quality: 0.8
        }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized kittens.jpg to fit within 256x256px');
        });
      
    });

}