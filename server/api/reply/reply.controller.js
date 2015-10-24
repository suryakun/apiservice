'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Reply = require('./reply.model');

// Get list of replys
exports.index = function(req, res) {
    Reply.find(function (err, replys) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(replys);
    });
};

// Get a single reply
exports.show = function(req, res) {
    Reply.findById(req.params.id, function (err, reply) {
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
    if (req.user.role == 'teacher') {
        reply._teacher = mongoose.Types.ObjectId(req.body.teacher_id);
    } else if (req.user.role == 'parent') {
        reply._parent = mongoose.Types.ObjectId(req.body.parent_id);
    }
    
    Reply.create(reply, function (err, rep) {
        if (err) { return res.status(500).send('Something wrong, please try again') };
        return res.status(201).json({ message: 'ok'});
    });
};

// Updates an existing reply in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Reply.findById(req.params.id, function (err, reply) {
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
    Reply.findById(req.params.id, function (err, reply) {
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
    Reply.find({ _story : story_id, {"$gt": date} }, function (err, reply) {
        if(err) { return handleError(res, err); }
        if(!reply) { return res.status(404).send('Not Found'); }        
        return res.status(204).send(reply);
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}