/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Parent = require('./parent.model');

exports.register = function(socket) {
  Parent.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Parent.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('parent:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('parent:remove', doc);
}