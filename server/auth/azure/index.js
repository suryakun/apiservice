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
    passport.authenticate('azureoauth'),
    function(req, res) {
        var user = req.user;
        if (!user || user === 401) return res.render('index', { 
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