'use strict';

var _ = require('lodash');
var ReadStatus = require('./read-status.model');

// Get list of reads
exports.index = function(req, res) {
  ReadStatus.find({ active: true}, function (err, read) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(read);
  });
};

// Get a single read
exports.show = function(req, res) {
  ReadStatus.find({_id: req.params.id, active: true}, function (err, read) {
    if(err) { return handleError(res, err); }
    if(!read) { return res.status(404).send('Not Found'); }
    return res.json(read);
  });
};

// Creates a new read in the DB.
exports.create = function(req, res) {
  ReadStatus.create(req.body, function(err, read) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(read);
  });
};

// Updates an existing read in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ReadStatus.find({_id: req.params.id, active: true}, function (err, read) {
    if (err) { return handleError(res, err); }
    if(!read) { return res.status(404).send('Not Found'); }
    var updated = _.merge(read, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(read);
    });
  });
};

// Deletes a read from the DB.
exports.destroy = function(req, res) {
  ReadStatus.find({_id: req.params.id, active: true}, function (err, read) {
    if(err) { return handleError(res, err); }
    if(!read) { return res.status(404).send('Not Found'); }
    read.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}