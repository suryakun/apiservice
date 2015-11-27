'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Reply = require('./reply.model');
var Thing = require('../thing/thing.controller');
var User = require('../user/user.model');
var Story = require('../story/story.model');
var _ = require('lodash');
var gcm = require('android-gcm');
var gcmObject = new gcm.AndroidGcm('AIzaSyBpjxJEYkAfLMhEWBq2ger2_0EV60VtdW4');

// Get list of replys
exports.index = function(req, res) {
    Reply.find({ active: true}, function (err, replys) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(replys);
    });
};

// Get a single reply
exports.show = function(req, res) {
    Reply.find({_id: req.params.id, active: true}, function (err, reply) {
        if(err) { return handleError(res, err); }
        if(!reply) { return res.status(404).send('Not Found'); }
        return res.json(reply);
    });
};

// Creates a new reply in the DB.
exports.create = function(req, res) {
    var reply = {};
    reply.info = req.body.info;
    reply._story = mongoose.Types.ObjectId(req.body.story_id);
    var receiver_message = [];
    var receiver_cc = [];
    if (req.user.role == 'teacher') {
        reply._teacher = mongoose.Types.ObjectId(req.user._id);
    } else if (req.user.role == 'parent') {
        reply._parent = mongoose.Types.ObjectId(req.user._id);
    }
    
    Reply.create(reply, function (err, rep) {
        if (err) { return res.status(500).send('Something wrong, please try again') };
        Story.findById(req.body.story_id).populate("_teacher").populate("_parent").populate("_cc").populate("_group").exec(function (err, story) {
            if(err) { return handleError(res, err); }
            if(!story) { return res.status(404).send('Story Not Found'); }
            if (req.user.role == 'teacher') {
                _.each(story._parent, function (parent, index) {
                    if (parent.gcm_id) receiver_message.push(parent.gcm_id);
                });
            } else {
                if (story._teacher.gcm_id) receiver_message.push(story._teacher.gcm_id);
            };

            _.each(story._cc, function (cc, index) {
                if (cc.gcm_id) receiver_cc.push(cc.gcm_id);
            });

            User.findById(req.user._id, function (err, user) {
                user._reply.push(rep._id);
                user.save();
            });

            story._reply.push(rep._id);
            story.save();

            if (receiver_message.length > 0) {
                sendGCM (receiver_message, 'reply', req.user._id, story_id, story._id);
            };

            if (receiver_cc.length > 0) {
                sendGCM (receiver_cc, 'reply', req.user._id, story_id, story._id);
            };

            return res.status(201).json({message: 'ok'});
        });
    });
};

// Updates an existing reply in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Reply.find({_id: req.params.id, active: true}, function (err, reply) {
        if (err) { return handleError(res, err); }
        if(!reply) { return res.status(404).send('Not Found'); }
        var updated = _.merge(reply, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(reply);
        });
    });
};

// Deletes a reply from the DB.
exports.destroy = function(req, res) {
    Reply.find({_id: req.params.id, active: true}, function (err, reply) {
        if(err) { return handleError(res, err); }
        if(!reply) { return res.status(404).send('Not Found'); }
        reply.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

// Deletes a reply from the DB.
exports.getReplyByDate = function(req, res) {
    var story_id = mongoose.Types.ObjectId(req.body.story_id);
    var date = new Date(req.body.date);
    Reply.find({ _story : story_id, createdAt: {"$gt": date}, active: true }, function (err, reply) {
        if(err) { return handleError(res, err); }
        if(!reply) { return res.status(404).send('Not Found'); }        
        return res.status(204).send(reply);
    });
};

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