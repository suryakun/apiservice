'use strict';

var express = require('express');
var controller = require('./level.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:id', auth.hasRole(['admin','moderator']), controller.index);
router.get('/single/:id', auth.hasRole(['admin','moderator']), controller.show);
router.post('/', auth.hasRole(['admin','moderator']), controller.create);
router.put('/:id', auth.hasRole(['admin','moderator']), controller.update);
router.patch('/:id', auth.hasRole(['admin','moderator']), controller.update);
router.delete('/:id', auth.hasRole(['admin','moderator']), controller.destroy);
router.get('/get-class-by-level-id', controller.getClassByLevelId);
router.get('/active/:id', controller.active);

module.exports = router;