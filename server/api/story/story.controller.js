// 'use strict';

var _ = require('lodash');
var Story = require('./story.model');
var Azure = require('./story.azure');
var User = require('../user/user.model');
var Photo = require('../photo/photo.model');
var Teacher = require('../teacher/teacher.model');
var Classd = require('../class/class.model');
var Group = require('../group/group.model');
var Reply = require('../reply/reply.model');
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
        return res.json(story);
    });
};

// Get a single story more detail
exports.detail = function(req, res) {
    Story.find({_id: req.params.id, active: true}, function (err, story) {
        if(err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        Story.populate(story, {
            path: "_teacher",
            select: "name email avatar role",
        }, function (err, story) {
            Story.populate(story, {
                path: "_parent",
                select: "name email avatar role",
            }, function (err, story) {
                Story.populate(story, {
                    path: "_class",
                    select: "name",
                }, function (err, story) {
                    Story.populate(story, {
                        path: "_group",
                        select: "name",
                    }, function (err, story) {
                        Story.populate(story, {
                            path: "_photo",
                            select: "url thumb",
                        }, function (err, story) {
                            return res.json(story);
                        });
                    });
                });
            });
        });
    });
};

exports.getReply = function(req, res) {
    var story_id = req.params.id;
    handleString(res, story_id);
    Story.getReplyByStoryId(story_id, function (err, story) {
        if(err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        Reply.populate(story._reply, {
            path: "_teacher",
            select: "name email avatar role",
        }, function (err, reply) {
            Reply.populate(reply, {
                path: "_parent",
                select: "name email avatar role",
            }, function (err, reply) {
                return res.json(reply);
                // res.status(200).json(story._reply);
            });
        });
    });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
    var form = new formidable.IncomingForm();
    
    form.parse(req, function(err, fields, files) {


        switch(fields.type){
            case "intern":
                if (fields.hasOwnProperty('group_id')) {
                    if (req.user.role == 'parent') { return res.status(401).send('parent cannot create info Story'); };
                    var gcm_ids = [], ios_ids = [], dataG = {}, filename = [], uniqid = Date.now();
                    
                    dataG._teacher = mongoose.Types.ObjectId(req.user._id);
                    dataG.info = fields.info;
                    dataG.type = fields.type;
                    dataG.active = true;
                    dataG._group = mongoose.Types.ObjectId(fields.group_id);
                    dataG._parent = [];
                    dataG._photo = [];

                    Group.findById(fields.group_id).exec(getUsersFromGroup);
                    
                    function getUsersFromGroup (err, group) {
                        if(err) { return handleError(res, err); }
                        if(!group) { return res.status(404).send('Not Found'); }
                        var user_ids = group._teacher;
                        Story.create(dataG, processStoryForGroup);
                    }

                    function processStoryForGroup (err, story) {
                        if(err) { return handleError(res, err); }
                        if(!story) { return res.status(404).send('Not Found'); }
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
                            processPhotoForGroup (filename, story);
                        }
                        processInsertStoryToGroupUsers (story);
                        updateStoryToBeMine (story);
                    }

                    function processPhotoForGroup (filename, story) {
                        Photo.create(filename, function (err, photos) {
                            var photo_ids = _.pluck(photos, "_id");
                            Photo.update({_id:{$in:photo_ids}}, {_user: mongoose.Types.ObjectId(req.user._id), _story: story._id}, {multi:true}, function (err, ok) {
                                console.log(ok);
                            });
                            Story.update({_id: story._id}, {$pushAll: {_photo: photo_ids}}, {multi:true}, function (err, ok) {
                                console.log(ok);
                            });
                        });
                    }

                    function processInsertStoryToGroupUsers (story) {
                        Group.findById(fields.group_id).exec(function (err, group) {
                            User.update({_id: {$in:group._teacher}}, {$push:{_story:story._id}}, {multi:true}, function (err, ok) {
                                if (err) console.log(err);
                                console.log(ok);
                            });
                            Story.update({_id:story._id}, {$set:{_group:group._id}}, {multi:false}, function (err, ok) {
                                console.log(ok);
                            });
                            sendGCMtoUserInGroup (story, group);
                        });
                    }

                    function sendGCMtoUserInGroup (story, group) {
                        User.find({_id:{$in:group._teacher}}).exec(function (err, user) {
                            var gcm_ids_group = _.pluck(user, "gcm_id");
                            if (gcm_ids_group.length > 0) {
                                sendGCM (gcm_ids_group, 'story', req.user._id, story._id);
                            };
                        })
                    }

                    function updateStoryToBeMine (story) {
                        User.update({_id:req.user._id}, {$push:{_story: story._id}}, {multi:false}, function (err, ok) {
                            console.log(ok);
                            return res.json({message:'ok'});
                        });
                    }
                };
                break;

            case "info":
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
                dataDescription._class = fields.class_id.split(",");
                dataDescription._parent = [];
                dataDescription._photo = [];
                if (fields.hasOwnProperty("group")) {
                    dataDescription._group = fields.group.split(",");;
                };                  

                Classd.find({_id: {$in:dataDescription._class}}).populate("_student").exec(function (err, destClass) {
                    var ids_parent = [];
                    if (err) console.log(err);
                    if (!destClass) {
                        console.log("not found")
                        return false;
                    };
                    var student_id = _.pluck(destClass, "_student");
                    for (var i = 0; i < student_id.length; i++) {
                        for (var j = 0; j < student_id[i].length; j++) {
                            ids_parent.push(student_id[i][j]);
                        };
                    };

                    User.populate(ids_parent, {
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
                                        Story.update({_id: story._id}, {$push: {_photo: photo._id}}, {multi:false}, function (err, ok) {
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

                            if (fields.hasOwnProperty('cc') && fields.cc.length > 0) { 
                                var Cc = fields.cc.split(","); 
                                if (Cc.length > 0) {
                                    User.update({ _id : { $in : Cc}}, {$push : { _story : story._id }}, {multi: true}, function (err, ok) {
                                        if (err) console.log(err);
                                        console.log(ok);
                                    });

                                    _.each(Cc, function (c, i) {
                                        Story.update({_id: story._id}, {$push: {_cc: c}}, {multi:false}, function (err, ok) {
                                            console.log(ok);
                                        });
                                    });
                                    
                                    User.find({_id : {$in: Cc}}).exec(function (err, cc_user) {
                                        var cc_ids = _.pluck(cc_user, 'gcm_id');
                                        sendGCM (cc_ids, 'story', req.user._id, story._id);
                                    })
                                };
                            };

                            Classd.update({_id: {$in:dataDescription._class}}, {$push: {_story:story._id}}, {multi:true}).exec(function function_name (err, classd) {
                                sendGCM (gcm_ids, 'story', req.user._id, story._id);
                                return res.status(201).json({message: 'ok'});
                            });

                            User.findById(req.user._id, function (err, teacher) {
                                teacher._story.push(mongoose.Types.ObjectId(story._id));
                                teacher.save();
                            });

                            // console.log(dataDescription._parent);
                            User.update({_id: { $in : dataDescription._parent }}, {$push : {'_story': mongoose.Types.ObjectId(story._id)}}, {multi: true}, function (err, parent) {
                                console.log(parent);
                            });

                            function sendGCMtoUserInGroup (story, group) {
                                User.find({_id:{$in:group._teacher}}).exec(function (err, user) {
                                    var gcm_ids_group = _.pluck(user, "gcm_id");
                                    if (gcm_ids_group.length > 0) {
                                        sendGCM (gcm_ids_group, 'story', req.user._id, story._id);
                                    };
                                })
                            }
                            
                            if (fields.hasOwnProperty("group_id")) {
                                var grp_id = fields.group_id.split(",");
                                Group.find({_id: {$in:grp_id}}).exec(function (err, g) {
                                    _.each(g, function (group, index) {
                                        User.update({_id: {$in:group._teacher}}, {$push:{_story:story._id}}, {multi:true}, function (err, ok) {
                                            if (err) console.log(err);
                                            console.log(ok);
                                        });
                                        Story.update({_id:story._id}, {$set:{_group:group._id}}, {multi:false}, function (err, ok) {
                                            console.log(ok);
                                        });
                                        sendGCMtoUserInGroup (story, group);
                                    })
                                });
                            };

                            User.find({_id: { $in : dataDescription._parent }}, function (err, parents) {
                                // var azureTokens = _.filter(_.pluck(parents, "azure"), function (p) {
                                //     return p.azure !== undefined;
                                // });
                                var newEvent = {
                                  "Subject": "Discuss the Calendar REST API",
                                  "Body": {
                                    "ContentType": "HTML",
                                    "Content": "I think it will meet our requirements!"
                                  },
                                  "Start": {
                                    "DateTime": "2016-05-03T18:00:00",
                                    "TimeZone": "Eastern Standard Time"
                                  },
                                  "End": {
                                    "DateTime": "2016-05-03T19:00:00",
                                    "TimeZone": "Eastern Standard Time"
                                  },
                                  "Attendees": [
                                    {
                                      "EmailAddress": {
                                        "Address": "allieb@contoso.com",
                                        "Name": "Allie Bellew"
                                      },
                                      "Type": "Required"
                                    }
                                  ]
                                };

                                Azure.createCalendar("azhararr@cendekialeadershipschool.onmicrosoft.com", newEvent);
                                Azure.getEvents("azhararr@cendekialeadershipschool.onmicrosoft.com");

                                var emails = _.pluck(parents, "email");
                                var joinMail = emails.join();
                                var text = {
                                    author: req.user.name,
                                    description: dataDescription.info
                                }
                                Azure.sendMail(joinMail, text);

                            });

                        });
                    });
                });
                break;

            case "diary":
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

                                User.update({_id:req.user._id}, {$push: {_story:mongoose.Types.ObjectId(story._id)}}, {multi:false}, function (err, ok) {
                                    console.log(ok);
                                });
                                
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
                break;

            case "activity":
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
                dataDescription._class = fields.class_id.split(",");
                dataDescription._parent = [];
                dataDescription._photo = [];
                if (fields.hasOwnProperty("group")) {
                    dataDescription._group = fields.group.split(",");;
                };

                Classd.find({_id: {$in:dataDescription._class}}).populate("_student").exec(function (err, destClass) {
                    var ids_parent = [];
                    if (err) console.log(err);
                    if (!destClass) {
                        console.log("not found")
                        return false;
                    };
                    var student_id = _.pluck(destClass, "_student");
                    for (var i = 0; i < student_id.length; i++) {
                        for (var j = 0; j < student_id[i].length; j++) {
                            ids_parent.push(student_id[i][j]);
                        };
                    };

                    User.populate(ids_parent, {
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
                                        Story.update({_id: story._id}, {$push: {_photo: photo._id}}, {multi:false}, function (err, ok) {
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

                            if (fields.hasOwnProperty('cc') && fields.cc.length > 0) { 
                                var Cc = fields.cc.split(","); 
                                if (Cc.length > 0) {
                                    User.update({ _id : { $in : Cc}}, {$push : { _story : story._id }}, {multi: true}, function (err, ok) {
                                        if (err) console.log(err);
                                        console.log(ok);
                                    });

                                    _.each(Cc, function (c, i) {
                                        Story.update({_id: story._id}, {$push: {_cc: c}}, {multi:false}, function (err, ok) {
                                            console.log(ok);
                                        });
                                    });
                                    
                                    User.find({_id : {$in: Cc}}).exec(function (err, cc_user) {
                                        var cc_ids = _.pluck(cc_user, 'gcm_id');
                                        sendGCM (cc_ids, 'story', req.user._id, story._id);
                                    })
                                };
                            };

                            Classd.update({_id: {$in:dataDescription._class}}, {$push: {_story:story._id}}, {multi:true}).exec(function function_name (err, classd) {
                                sendGCM (gcm_ids, 'story', req.user._id, story._id);
                                return res.status(201).json({message: 'ok'});
                            });

                            User.findById(req.user._id, function (err, teacher) {
                                teacher._story.push(mongoose.Types.ObjectId(story._id));
                                teacher.save();
                            });

                            // console.log(dataDescription._parent);
                            User.update({_id: { $in : dataDescription._parent }}, {$push : {'_story': mongoose.Types.ObjectId(story._id)}}, {multi: true}, function (err, parent) {
                                console.log(parent);
                            });

                            function sendGCMtoUserInGroup (story, group) {
                                User.find({_id:{$in:group._teacher}}).exec(function (err, user) {
                                    var gcm_ids_group = _.pluck(user, "gcm_id");
                                    if (gcm_ids_group.length > 0) {
                                        sendGCM (gcm_ids_group, 'story', req.user._id, story._id);
                                    };
                                })
                            }
                            
                            if (fields.hasOwnProperty("group_id")) {
                                var grp_id = fields.group_id.split(",");
                                Group.find({_id: {$in:grp_id}}).exec(function (err, g) {
                                    _.each(g, function (group, index) {
                                        User.update({_id: {$in:group._teacher}}, {$push:{_story:story._id}}, {multi:true}, function (err, ok) {
                                            if (err) console.log(err);
                                            console.log(ok);
                                        });
                                        Story.update({_id:story._id}, {$set:{_group:group._id}}, {multi:false}, function (err, ok) {
                                            console.log(ok);
                                        });
                                        sendGCMtoUserInGroup (story, group);
                                    })
                                });
                            };

                        });
                    });
                });
                break;

            case "portfolio":
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

                                User.update({_id:req.user._id}, {$push: {_story:mongoose.Types.ObjectId(story._id)}}, {multi:false}, function (err, ok) {
                                    console.log(ok);
                                });
                                
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
                break;
        }

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
    Story.findOne({_id: req.params.id}, function (err, story) {
        if(err) { return handleError(res, err); }
        if(!story) { return res.status(404).send('Not Found'); }
        story.active = false;
        story.save(function () {
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
            width: "",
            height: "",
            quality: 0.5
        }, function(err, stdout, stderr){
            if (err) throw err;
            console.log('resized kittens.jpg to fit within 256x256px');
        });
      
    });

}