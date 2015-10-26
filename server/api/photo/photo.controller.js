'use strict';

var _ = require('lodash');
var Photo = require('./photo.model');

// Get list of photos
exports.index = function(req, res) {
  Photo.find({ active:true }, function (err, photos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(photos);
  });
};

// Get a single photo
exports.show = function(req, res) {
  Photo.find({_id: req.params.id, active: true}, function (err, photo) {
    if(err) { return handleError(res, err); }
    if(!photo) { return res.status(404).send('Not Found'); }
    return res.json(photo);
  });
};

// Creates a new photo in the DB.
exports.create = function(req, res) {
  Photo.create(req.body, function(err, photo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(photo);
  });
};

// Updates an existing photo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Photo.find({_id: req.params.id, active: true}, function (err, photo) {
    if (err) { return handleError(res, err); }
    if(!photo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(photo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(photo);
    });
  });
};

// Deletes a photo from the DB.
exports.destroy = function(req, res) {
  Photo.find({_id: req.params.id, active: true}, function (err, photo) {
    if(err) { return handleError(res, err); }
    if(!photo) { return res.status(404).send('Not Found'); }
    photo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

exports.getStoryByPhotoId = function (req, res) {
  var photo_id = req.params.id;
  handleString(res, photo_id);
  Photo.getStoryByPhotoId(photo_id, function (err, data) {
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