/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var ReadStatus = require('./read-status.model');

exports.register = function(socket) {
  ReadStatus.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  ReadStatus.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('read-status:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('read-status:remove', doc);
}