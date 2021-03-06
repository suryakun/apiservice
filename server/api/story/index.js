'use strict';

var express = require('express');
var controller = require('./story.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/single/:id', controller.show);
router.post('/', auth.hasRole('teacher', 'parent'), controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/get-reply-by-story-id/:id', auth.hasRole(['teacher','student','parent']) ,controller.getReplyByStoryId);
router.get('/get-parent-by-story-id/:id', auth.hasRole(['teacher','student','parent']), controller.getParentByStoryId);
router.get('/get-photo-by-story-id/:id', auth.hasRole(['teacher','student','parent']), controller.getPhotoByStoryId);
router.get('/get-class-by-story-id/:id', auth.hasRole(['teacher','student','parent']), controller.getClassByStoryId);
router.get('/get-teacher-by-story-id/:id', auth.hasRole(['teacher','student','parent']), controller.getTeacherByStoryId);
router.post('/read-story', auth.hasRole(['teacher','parent']), controller.readStory);
router.get('/get-reader/:id', auth.hasRole(['teacher','parent']), controller.getReader);

router.get('/get-events/:start/:end', auth.hasRole(['teacher','parent', 'admin']), controller.getEvents);
// more detail story than SHOW route
router.get('/:id', controller.detail);
router.get('/:id/replies', controller.getReply);

router.get('/get-calendar-of-school/:school_id', auth.hasRole(['teacher','admin','parent']), controller.getCalendarOfSchool);
router.get('/get-calendar-of-user/:user_id', auth.hasRole(['teacher','admin','parent']), controller.getCalendarOfUser);

module.exports = router;