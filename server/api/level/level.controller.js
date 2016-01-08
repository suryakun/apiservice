'use strict';

var _ = require('lodash');
var Level = require('./level.model');

// Get list of levels
exports.index = function(req, res) {
  Level.find({active: true, _school:req.params.id}, function (err, levels) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(levels);
  });
};

// Get a single level
exports.show = function(req, res) {
  Level.find({_id: req.params.id, active: true}, function (err, level) {
    if(err) { return handleError(res, err); }
    if(!level) { return res.status(404).send('Not Found'); }
    return res.json(level);
  });
};

// Creates a new level in the DB.
exports.create = function(req, res) {
  Level.create(req.body, function(err, level) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(level);
  });
};

// Updates an existing level in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Level.findOne({_id: req.params.id, active: true}, function (err, level) {
    if (err) { return handleError(res, err); }
    if(!level) { return res.status(404).send('Not Found'); }
    var updated = _.merge(level, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(level);
    });
  });
};

// Deletes a level from the DB.
exports.destroy = function(req, res) {
  Level.find({_id: req.params.id, active: true}, function (err, level) {
    if(err) { return handleError(res, err); }
    if(!level) { return res.status(404).send('Not Found'); }
    level.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.getClassByLevelId = function (req, res) {
  var level_id = req.params.id;
  handleString(res, level_id);
  Level.getClassByLevelId(level_id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    res.status(200).json(data);
  });
}

exports.active = function (req, res) {
  Level.findById(req.params.id, function (err, level) {
    if (level.active == true) {
      level.active = false;
      level.save();
    } else {
      level.active = true;
      level.save();
    }
  })
}

function handleString(res, string) {
  var type = typeof string;
  if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

function handleError(res, err) {
  return res.status(500).send(err);
}