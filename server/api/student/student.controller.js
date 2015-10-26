'use strict';

var _ = require('lodash');
var Student = require('./student.model');

// Get list of students
exports.index = function(req, res) {
  Student.find({ active: true}, function (err, students) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(students);
  });
};

// Get a single student
exports.show = function(req, res) {
  Student.find({_id: req.params.id, active: true}, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.status(404).send('Not Found'); }
    return res.json(student);
  });
};

// Creates a new student in the DB.
exports.create = function(req, res) {
  Student.create(req.body, function(err, student) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(student);
  });
};

// Updates an existing student in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Student.find({_id: req.params.id, active: true}, function (err, student) {
    if (err) { return handleError(res, err); }
    if(!student) { return res.status(404).send('Not Found'); }
    var updated = _.merge(student, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(student);
    });
  });
};

// Deletes a student from the DB.
exports.destroy = function(req, res) {
  Student.find({_id: req.params.id, active: true}, function (err, student) {
    if(err) { return handleError(res, err); }
    if(!student) { return res.status(404).send('Not Found'); }
    student.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}