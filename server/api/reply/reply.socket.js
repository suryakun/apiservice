/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Reply = require('./reply.model');

exports.register = function(socket) {
  Reply.schema.post('save', function (doc) {
    Reply.populate(doc, {
        path: "_teacher",
        select: "name email avatar",
    }, function(err, reply) {
        Reply.populate(doc, {
            path: "_parent",
            select: "name email avatar",
        }, function(err, reply) {
            onSave(socket, reply);
        });
    });
  });
  Reply.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('reply:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('reply:remove', doc);
}