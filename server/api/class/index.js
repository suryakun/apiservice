'use strict';

var express = require('express');
var controller = require('./class.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/single/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/get-all-student-by-class-id/:id', controller.getAllStudentByClassdId);
router.get('/get-school-by-class-id/:id', controller.getSchoolByClassId);
router.get('/get-level-by-class-id/:id', controller.getLevelByClassId);

module.exports = router;