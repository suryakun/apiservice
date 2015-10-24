'use strict';

var _ = require('lodash');
var Parent = require('./parent.model');

// Get list of parents
exports.index = function(req, res) {
  Parent.find(function (err, parents) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(parents);
  });
};

// Get a single parent
exports.show = function(req, res) {
  Parent.findById(req.params.id, function (err, parent) {
    if(err) { return handleError(res, err); }
    if(!parent) { return res.status(404).send('Not Found'); }
    return res.json(parent);
  });
};

// Creates a new parent in the DB.
exports.create = function(req, res) {
  Parent.create(req.body, function(err, parent) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(parent);
  });
};

// Updates an existing parent in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Parent.findById(req.params.id, function (err, parent) {
    if (err) { return handleError(res, err); }
    if(!parent) { return res.status(404).send('Not Found'); }
    var updated = _.merge(parent, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(parent);
    });
  });
};

// Deletes a parent from the DB.
exports.destroy = function(req, res) {
  Parent.findById(req.params.id, function (err, parent) {
    if(err) { return handleError(res, err); }
    if(!parent) { return res.status(404).send('Not Found'); }
    parent.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}