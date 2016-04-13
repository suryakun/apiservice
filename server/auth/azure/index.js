'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
var School = require('../../api/school/school.model');
var Class = require('../../api/class/class.model');
var User = require('../../api/user/user.model');
var request = require('request');
var config = require('../../config/environment');
var _ = require('lodash');

var router = express.Router();

router
  .get('/', passport.authenticate('azureoauth'))

  .get('/callback', 
    passport.authenticate('azureoauth'),
    function(req, res) {
        var user = req.user;
        if (!user || (user[0] && user[0] === 401)) return res.render('index', { 
          success: false, 
          result: {
            error: 'No account connected',
            email: user[1]
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
  )

  .get('/sign-in', passport.authenticate('azureoauthuser', {
        // Redirect to Client Apps
        redirect_uri: (process.env.DOMAIN || 'http://web.7pagi.com') + '/auth/azure/sign-in/callback'
  }))
  
  .get('/sign-in/callback',  
    function(req, res) {
        /* Menggunakan request karena tidak bisa menggunakan middleware azureoauthuser (Failed to obtain access token)*/
        // https://msdn.microsoft.com/en-us/library/azure/dn645542.aspx
        request.post({
            url:'https://login.windows.net/common/oauth2/token', 
            form: {
                grant_type: 'authorization_code', // 'refresh_token'
                resource: 'https://graph.microsoft.com/',
                redirect_uri: (process.env.DOMAIN || 'http://web.7pagi.com') + '/auth/azure/sign-in/callback',
                client_id: config.azure.clientID,
                client_secret: config.azure.clientSecret,
                code: req.query.code // refresh_token 
            }
        }, function(err, httpResponse, body){
            var responseToken = JSON.parse(body);
            request.get('https://graph.microsoft.com/v1.0/me', {
                auth : { 
                    'bearer' : responseToken.access_token 
                } 
            }, function(err, httpResponse, user) { 
                var responseUser = JSON.parse(user);
                User.findOne({email: responseUser.mail.toLowerCase()}, function(err, user) {
                    if (err || !user) {
                        return res.redirect(302, '/callback?error=400&email=' + responseUser.mail.toLowerCase());
                    } 
                    var token = auth.signToken(user._id, user.role);  
                    return res.redirect(302, '/callback?token=' + token + '&id=' + user._id + '&role=' + user.role);
                });
            });
        });
    }
  );


module.exports = router;