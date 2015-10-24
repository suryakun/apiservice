/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Level = require('./level.model');

exports.register = function(socket) {
  Level.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Level.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('level:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('level:remove', doc);
}