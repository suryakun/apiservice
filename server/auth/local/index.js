'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var School = require('../../api/school/school.model');
var Class = require('../../api/class/class.model');
var User = require('../../api/user/user.model');

var router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({message: 'Something went wrong, please try again.'});
    var token = auth.signToken(user._id, user.role);
    if (user.role === 'student' || user.role === 'teacher') {
    	Class.findById(user._class).populate('_school').exec(function (err, clas) {
            console.log(clas);
			if (err) return res.status(401).json(error);
		    if (!clas) return res.status(404).json({message: 'Something went wrong, please try again.'});
		    res.json({token: token, id:user._id, name: user.name, avatar:user.avatar || '', school_name: clas._school.name || '', role: user.role });
    	});
    } else {
        User.findById(user._id).populate("_student").exec(function (err, user) {
            Class.findById(user._student[0]._class).populate("_school").exec(function (err, clas) {
                res.json({token: token, id:user._id, name: user.name, avatar:user.avatar || '', school_name: clas._school.name, role: user.role });
            });
        })
    }
  })(req, res, next)
});

module.exports = router;