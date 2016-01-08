'use strict';

var express = require('express');
var controller = require('./foundation.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole(['admin','moderator']), controller.index);
router.get('/single/:id', auth.hasRole(['admin','moderator']), controller.show);
router.post('/', auth.hasRole(['admin','moderator']), controller.create);
router.get('/active/:id', auth.hasRole(['admin','moderator']), controller.active);
router.put('/:id', auth.hasRole(['admin','moderator']), controller.update);
router.patch('/:id', auth.hasRole(['admin','moderator']), controller.update);
router.delete('/:id', auth.hasRole(['admin','moderator']), controller.destroy);
router.get('/get-school-by-foundation-id/:id', controller.getSchoolsByFoundationId);

module.exports = router;