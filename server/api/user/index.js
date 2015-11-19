'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/single/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/get-reply-by-user-id/:id', controller.getReplyByUserId);
router.get('/get-student-by-parent-id/:id', controller.getStudentByParentId);
router.get('/get-story-by-teacher-id/:id', controller.getStoryByTeacherId);
router.post('/upload-profile', auth.hasRole(['admin', 'parent', 'teacher']), controller.updateProfile);
router.get('/get-students-from-my-school', auth.hasRole(['teacher', 'student']), controller.getStudentsFromMySchool);
router.get('/get-my-stories', auth.hasRole(['teacher','parent']), controller.getMyStories);
router.get('/get-my-class', auth.hasRole(['teacher','parent']), controller.getMyClass);
router.post('/update-gcm-id', auth.hasRole(['teacher','parent','student','principal']), controller.updateGcmId);
router.post('/get-story-by-date', auth.hasRole(['teacher','parent']), controller.getMyStoriesByDate);
router.post('/get-all-principal', auth.hasRole(['admin']), controller.getAllPrincipal);
router.get('/get-all-parent-from-my-school', auth.hasRole(['teacher','parent']), controller.getAllParentFromMySchool);
router.get('/get-all-teacher-from-my-school', auth.hasRole(['teacher','parent']), controller.getTeacherOfMySchool);

module.exports = router;
