'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('azureoauth'))

  .get('/callback', passport.authenticate('azureoauth', {
    failureRedirect: '/login',
    session: false
  }), function (req, res) {
    console.log(res);
    // Successful authentication, redirect home.
    res.redirect('/');
  });
    // app.get('/auth/azureadoauth2',
    //   passport.authenticate('azure_ad_oauth2'));

    // app.get('/auth/azureadoauth2/callback', 
    //   passport.authenticate('azure_ad_oauth2', { failureRedirect: '/login' }),
    //   function (req, res) {
    //     // Successful authentication, redirect home.
    //     res.redirect('/');
    //   });
module.exports = router;