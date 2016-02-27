'use strict';

var _ = require('lodash');
var Main = require('./main.model');
var errors = require('./components/errors');
var path = require('path');


// Get list of mains
exports.index = function(req, res) {
  res.send('Hellow');
};

// Get a single main
exports.show = function(req, res) {
  Main.findById(req.params.id, function (err, main) {
    if(err) { return handleError(res, err); }
    if(!main) { return res.status(404).send('Not Found'); }
    return res.json(main);
  });
};

// Creates a new main in the DB.
exports.create = function(req, res) {
  Main.create(req.body, function(err, main) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(main);
  });
};

// Updates an existing main in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Main.findById(req.params.id, function (err, main) {
    if (err) { return handleError(res, err); }
    if(!main) { return res.status(404).send('Not Found'); }
    var updated = _.merge(main, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(main);
    });
  });
};

// Deletes a main from the DB.
exports.destroy = function(req, res) {
  Main.findById(req.params.id, function (err, main) {
    if(err) { return handleError(res, err); }
    if(!main) { return res.status(404).send('Not Found'); }
    main.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}