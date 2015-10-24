'use strict';

var _ = require('lodash');
var Teacher = require('./teacher.model');

// Get list of teachers
exports.index = function(req, res) {
  Teacher.find(function (err, teachers) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(teachers);
  });
};

// Get a single teacher
exports.show = function(req, res) {
  Teacher.findById(req.params.id, function (err, teacher) {
    if(err) { return handleError(res, err); }
    if(!teacher) { return res.status(404).send('Not Found'); }
    return res.json(teacher);
  });
};

// Creates a new teacher in the DB.
exports.create = function(req, res) {
  Teacher.create(req.body, function(err, teacher) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(teacher);
  });
};

// Updates an existing teacher in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Teacher.findById(req.params.id, function (err, teacher) {
    if (err) { return handleError(res, err); }
    if(!teacher) { return res.status(404).send('Not Found'); }
    var updated = _.merge(teacher, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(teacher);
    });
  });
};

// Deletes a teacher from the DB.
exports.destroy = function(req, res) {
  Teacher.findById(req.params.id, function (err, teacher) {
    if(err) { return handleError(res, err); }
    if(!teacher) { return res.status(404).send('Not Found'); }
    teacher.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}