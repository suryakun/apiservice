/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Teacher = require('./teacher.model');

exports.register = function(socket) {
  Teacher.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Teacher.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('teacher:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('teacher:remove', doc);
}