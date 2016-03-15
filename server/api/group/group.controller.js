'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var Classd = require('../class/class.model');
var School = require('../school/school.model');
var User = require('../user/user.model');

// Get list of groups
exports.index = function(req, res) {
    var id = req.user._id;
    return User.findById(id).populate("_class").populate("_student").exec(function (err, me) {
        if (me.role == 'teacher') {
            Classd.findById(me._class).populate("_school").exec(function (err, cls) {
                var sch_id = cls._school._id;
                Group.find({_school : sch_id},function (err, groups) {
                    if(err) { return handleError(res, err); }
                    return res.status(200).json(groups);
                });
            });
        };

        if (me.role == 'parent') {
            Classd.findById(me._student[0]._class).populate("_school").exec(function (err, cls) {
                var sch_id = cls._school._id;
                Group.find({_school : sch_id},function (err, groups) {
                    if(err) { return handleError(res, err); }
                    return res.status(200).json(groups);
                });
            });
        };
    });
};

// Get a single group
exports.show = function(req, res) {
  var sch_id = req.params.school_id;
  Group.find({_school : sch_id},function (err, groups) {
      if(err) { return handleError(res, err); }
      return res.status(200).json(groups);
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}