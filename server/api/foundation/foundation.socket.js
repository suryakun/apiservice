/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Foundation = require('./foundation.model');

exports.register = function(socket) {
  Foundation.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Foundation.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('foundation:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('foundation:remove', doc);
}