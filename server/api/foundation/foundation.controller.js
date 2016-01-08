'use strict';

var _ = require('lodash');
var Foundation = require('./foundation.model');
var User = require('../user/user.model');

// Get list of foundations
exports.index = function(req, res) {
  if (req.user.role == 'moderator') {
    User.findById(req.user._id).populate("_school").exec(function (err, user) {
      var school = user._school;
      Foundation.find({_id: school._foundation, active: true}).exec(function (err, foundations) {
        if(err) { return handleError(res, err); }
        return res.status(200).json(foundations);
      });
    });
  };

  if (req.user.role == 'admin') {
    Foundation.find({active: true}).exec(function (err, foundations) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(foundations);
    });
  }
};

// Get a single foundation
exports.show = function(req, res) {
  Foundation.find({ _id: req.params.id, active: true}, function (err, foundation) {
    if(err) { return handleError(res, err); }
    if(!foundation) { return res.status(404).send('Not Found'); }
    return res.json(foundation);
  });
};

// Creates a new foundation in the DB.
exports.create = function(req, res) {
  req.body.active = true;
  Foundation.create(req.body, function(err, foundation) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(foundation);
  });
};

// Updates an existing foundation in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Foundation.findById(req.params.id, function (err, foundation) {
    if (err) { return handleError(res, err); }
    if(!foundation) { return res.status(404).send('Not Found'); }
    var updated = _.merge(foundation, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(foundation);
    });
  });
};

// Deletes a foundation from the DB.
exports.destroy = function(req, res) {
  Foundation.find({ _id: req.params.id, active: true}, function (err, foundation) {
    if(err) { return handleError(res, err); }
    if(!foundation) { return res.status(404).send('Not Found'); }
    foundation.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.active = function (req, res) {
  Foundation.findById(req.params.id, function (err, foundation) {
    if (foundation.active == true) {
      foundation.active = false;
      foundation.save();
    } else {
      foundation.active = true;
      foundation.save();
    }
  })
}
//Get Schools By Foundation Id
exports.getSchoolsByFoundationId = function(req, res) {
  var param = req.params.id;
  handleString(res, param);
  if(err) { return handleError(res, err); }
  Foundation.getAllSchoolById(param, function (err, schools) {
    if(!schools) { return res.status(404).send('Not Found'); }
    console.log(schools);
    return res.status(200).json(schools._school);
  });
};

function handleString(res, string) {
  var type = typeof string;
  if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

function handleError(res, err) {
  return res.status(500).send(err);
}