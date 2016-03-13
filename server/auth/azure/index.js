'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('azureoauth', { failureRedirect: '/', session: true }))

  .get('/callback', 
    passport.authenticate('azureoauth'),
    function (req, res) {
      res.json({token: passport.user}); // No Problem
      // res.render('index', { token : passport.user }); // // Problem is here
  })

  .get('/test', function (req, res) {
      return res.render('index', { token: 'Abcde' }); // No Problem
  });

module.exports = router;