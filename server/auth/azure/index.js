'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var School = require('../../api/school/school.model');
var Class = require('../../api/class/class.model');
var User = require('../../api/user/user.model');

var router = express.Router();

router
  .get('/', passport.authenticate('azureoauth'))

  .get('/callback', 
    function (req, res, next) {
      User.findOne({_id: '56e6ecaa357ac1483b854c3f'}, function(err, user) {
        // console.log(err, user);
        /**/
        if (!user || !user._id) return res.render('index', { 
          success: false, 
          result: {
            error: 'No account connected'
          }
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
        });

      });

  });

module.exports = router;