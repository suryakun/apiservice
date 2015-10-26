'use strict';

var _ = require('lodash');
var History = require('./history.model');

// Get list of historys
exports.index = function(req, res) {
  History.find({_id: req.params.id, active: true}, function (err, historys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(historys);
  });
};

// Get a single history
exports.show = function(req, res) {
  History.find({_id: req.params.id, active: true}, function (err, history) {
    if(err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    return res.json(history);
  });
};

// Creates a new history in the DB.
exports.create = function(req, res) {
  History.create(req.body, function(err, history) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(history);
  });
};

// Updates an existing history in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  History.find({_id: req.params.id, active: true}, function (err, history) {
    if (err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    var updated = _.merge(history, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(history);
    });
  });
};

// Deletes a history from the DB.
exports.destroy = function(req, res) {
  History.find({_id: req.params.id, active: true}, function (err, history) {
    if(err) { return handleError(res, err); }
    if(!history) { return res.status(404).send('Not Found'); }
    history.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}