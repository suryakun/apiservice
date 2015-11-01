/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';


var _ = require('lodash');
var gcm = require('node-gcm');
var message = new gcm.Message();
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {
    Thing.find(function (err, things) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(things);
    });
};

// Get a single thing
exports.show = function(req, res) {
    Thing.findById(req.params.id, function (err, thing) {
        if(err) { return handleError(res, err); }
        if(!thing) { return res.status(404).send('Not Found'); }
        return res.json(thing);
    });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
    Thing.create(req.body, function(err, thing) {
        if(err) { return handleError(res, err); }
        return res.status(201).json(thing);
    });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
    if(req.body._id) { delete req.body._id; }
    Thing.findById(req.params.id, function (err, thing) {
        if (err) { return handleError(res, err); }
        if(!thing) { return res.status(404).send('Not Found'); }
        var updated = _.merge(thing, req.body);
        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(thing);
        });
    });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
    Thing.findById(req.params.id, function (err, thing) {
        if(err) { return handleError(res, err); }
        if(!thing) { return res.status(404).send('Not Found'); }
        thing.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.status(204).send('No Content');
        });
    });
};

exports.sendGcm = function (type, creator_id, story_id, regTokens) {
    if (type == "story") {
        message.addData('type', 'story');
    } else {
        message.addData('type', 'reply');
    };
    message.addData('sender', creator_id);
    message.addData('story_id', story_id);
    // Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyBpjxJEYkAfLMhEWBq2ger2_0EV60VtdW4');

    // Now the sender can be used to send messages
    sender.send(message, { registrationTokens: regTokens }, function (err, result) {
        if(err) console.error(err);
        console.log(result, 'testing gcm');
    });

    // Send to a topic, with no retry this time
    sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, result) {
        if(err) console.error(err);
        else    console.log(result);
    });
}

function handleError(res, err) {
    return res.status(500).send(err);
}