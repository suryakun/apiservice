'use strict';

var _ = require('lodash');
var School = require('./school.model');
var mongoose = require('mongoose');

// Get list of schools
exports.index = function(req, res) {
  School.find({ active: true}, function (err, schools) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(schools);
  });
};

// Get a single school
exports.show = function(req, res) {
  School.find({_id: req.params.id, active: true}, function (err, school) {
    if(err) { return handleError(res, err); }
    if(!school) { return res.status(404).send('Not Found'); }
    return res.json(school);
  });
};

// Creates a new school in the DB.
exports.create = function(req, res) {
  req.body._foundation = mongoose.Types.ObjectId(req.body._foundation);
  School.create(req.body, function(err, school) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(school);
  });
};

// Updates an existing school in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  School.findById(req.params.id, function (err, school) {
    if (err) { return handleError(res, err); }
    if(!school) { return res.status(404).send('Not Found'); }
    var updated = _.merge(school, req.body);
    console.log(updated)
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(school);
    });
  });
};

// Deletes a school from the DB.
exports.destroy = function(req, res) {
  School.find({_id: req.params.id, active: true}, function (err, school) {
    if(err) { return handleError(res, err); }
    if(!school) { return res.status(404).send('Not Found'); }
    school.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.getFoundationBySchoolId = function (req, res) {
  var school_id = req.params.id;
  handleString(res, school_id);
  School.getFoundationBySchoolId(school_id, function (err, foundation) {
    if(err) { return handleError(res, err); }
    if(!foundation) { return res.status(404).send('Not Found'); }
    res.status(200).json(foundation);
  })
}

exports.getClassBySchoolId = function (req, res) {
  var school_id = req.params.id;
  handleString(res, school_id);
  School.getClassBySchoolId(school_id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    res.status(200).json(data);
  });
}

exports.getSchoolsByFoundationId = function (req, res) {
  var foundation_id = req.params.id;
  handleString(res, foundation_id);
  School.find({_foundation:foundation_id, active:true}).exec(function (err, school) {
    if(err) { return handleError(res, err); }
    if(!school) { return res.status(404).send('Not Found'); }
    res.status(200).json(school);
  })
}

exports.active = function (req, res) {
  School.findById(req.params.id, function (err, school) {
    if (school.active == true) {
      school.active = false;
      school.save();
    } else {
      school.active = true;
      school.save();
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