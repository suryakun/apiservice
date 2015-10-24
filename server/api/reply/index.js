'use strict';

var express = require('express');
var controller = require('./reply.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole(['teacher', 'parent']), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.post('/get-reply-by-date', auth.hasRole(['teacher', 'parent']), controller.getReplyByDate);

module.exports = router;