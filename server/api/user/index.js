'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var passport = require('passport');

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
router.post('/create-parent', auth.hasRole(['admin']), controller.createParent);
router.post('/create-teacher', auth.hasRole(['admin']), controller.createTeacher);
router.get('/get-all-parent-from-my-school', auth.hasRole(['teacher','parent','admin']), controller.getAllParentFromMySchool);
router.get('/get-all-teacher-from-my-school', auth.hasRole(['teacher','parent','admin']), controller.getTeacherOfMySchool);
router.get('/get-story-filter/:type/:parent', auth.hasRole(['teacher','parent','admin']), controller.getStoryFilter);
router.get('/get-parent-for-admin/:id', auth.hasRole(['admin','moderator']), controller.getParentForAdmin);
router.get('/get-teacher-for-admin/:id', auth.hasRole(['admin']), controller.getTeacherForAdmin );
router.put('/update-user/:id', auth.hasRole(['admin']), controller.update);
router.put('/update-teacher/:id', auth.hasRole(['admin']), controller.updateTeacher);

router.get('/get-moderators/:id', auth.hasRole(['admin']), controller.getModerator);

router
  .get('/azure', passport.authenticate('azureoauth', {
    redirect_uri: (process.env.DOMAIN || '') + '/api/users/azure/callback'
  }))

  .get('/azure/callback', 
    passport.authenticate('azureoauth'),
    function(req, res) {
        var user = req.user;
        if (!user) return res.render('index', { 
          success: false, 
          result: {
            error: 'No account connected'
          }
        }, function(err, html) {
          res.send(html);
        });
        var token = auth.signToken(user._id, user.role);
        return res.render('index', { 
          success: true, 
          result: {
            token: token,
            id: user._id,
            name: user.name,
            role: user.role,
            avatar: user.avatar
          } 
        }, function(err, html) {
          res.send(html);
        });
    }
  );

module.exports = router;
