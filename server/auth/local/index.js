'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var School = require('../../api/school/school.model');
var Class = require('../../api/class/class.model');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});
    var token = auth.signToken(user._id, user.role);
    if (user.role === 'student' || user.role === 'teacher') {
    	Class.findById(user._class).exec(function (err, clas) {
			School.findById(clas._school).exec(function (err, school) {
				if (err) return res.status(401).json(error);
			    if (!school) return res.status(404).json({message: 'Something went wrong, please try again.'});
			    res.json({token: token, id:user._id, name: user.name, avatar:user.avatar || '', school_name: school.name});
			});
    	});
    } else {
    	res.json({token: token, id:user._id, name: user.name});
    }
  })(req, res, next)
});

module.exports = router;