'use strict';

var _ = require('lodash');
var Classd = require('./class.model');
var User = require('../user/user.model');
var mongoose = require('mongoose');

// Get list of classs
exports.index = function(req, res) {
  var user_id = req.user._id;
  if (req.user.role == 'teacher') {
      User.getClassForTeacher(user_id, function (err, me) {
          if(err) { return handleError(res, err); }
          if(!me) { return res.status(404).send('Not Found'); }
          var school_id = mongoose.Types.ObjectId(me._class._school._id);
          Classd.find({_school:school_id}).exec(function (err, classs) {
            if(err) { return handleError(res, err); }
            return res.status(200).json(classs);
          });
      });    
  } else if (req.user.role == 'parent') {
      User.getClassForParent(user_id, function (err, me) {
        if(err) { return handleError(res, err); }
        if(!me) { return res.status(404).send('Not Found'); }
        var d = me['_student'][0]['_class'].toObject();
        var school_id = mongoose.Types.ObjectId(d._school._id);
        Classd.find({_school:school_id}).exec(function (err, classs) {
          if(err) { return handleError(res, err); }
          return res.status(200).json(classs);
        });
      });
  }
  
};

// Get a single class
exports.show = function(req, res) {
  Classd.find({ _id: req.params.id, active: true}, function (err, classd) {
    if(err) { return handleError(res, err); }
    if(!classd) { return res.status(404).send('Not Found'); }
    return res.json(classd);
  });
};

// Creates a new class in the DB.
exports.create = function(req, res) {
  Classd.create(req.body, function(err, classd) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(classd);
  });
};

// Updates an existing class in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Classd.find({ _id: req.params.id, active: true}, function (err, classd) {
    if (err) { return handleError(res, err); }
    if(!classd) { return res.status(404).send('Not Found'); }
    var updated = _.merge(classd, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(classd);
    });
  });
};

// Deletes a class from the DB.
exports.destroy = function(req, res) {
  Classd.find({ _id: req.params.id, active: true}, function (err, classd) {
    if(err) { return handleError(res, err); }
    if(!classd) { return res.status(404).send('Not Found'); }
    classd.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.getAllStudentByClassdId = function (req, res) {
  var class_id = req.params.id;
  handleString(res, class_id);
  Classd.getAllStudentByClassdId(class_id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    res.status(200).json(data);
  });
}

exports.getSchoolByClassId = function (req, res) {
  var class_id = req.params.id;
  handleString(res, class_id);
  Classd.getSchoolByClassId(class_id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    res.status(200).json(data);
  });
}

exports.getLevelByClassId = function (req, res) {
  var class_id = req.params.id;
  handleString(res, class_id);
  Classd.getLevelByClassId(class_id, function (err, data) {
    if(err) { return handleError(res, err); }
    if(!data) { return res.status(404).send('Not Found'); }
    res.status(200).json(data);
  });
}

function handleString(res, string) {
  var type = typeof string;
  if ( type !== 'string' ) res.status(401).send({message: 'Bad Request'});
}

function handleError(res, err) {
  return res.status(500).send(err);
}