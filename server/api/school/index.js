'use strict';

var express = require('express');
var controller = require('./school.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/get-foundation-by-school-id/:id', controller.getFoundationBySchoolId);
router.get('/get-class-by-school-id/:id', controller.getClassBySchoolId);

module.exports = router;