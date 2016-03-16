var passport = require('passport');
var AzureOAuthStrategy = require('passport-azure-oauth').Strategy;
var jwt = require('jsonwebtoken');

exports.setup = function (User, config) {
  passport.use(new AzureOAuthStrategy({
      clientId: config.azure.clientID,
      clientSecret: config.azure.clientSecret,
      redirectURL: config.azure.callbackURL, 
      tenantId: 'common',
      resource: 'https://graph.microsoft.com/'
  },
  function(accessToken, refreshToken, params, profile, done) {
      // currently we can't find a way to exchange access token by user info (see userProfile implementation), so
      // you will need a jwt-package like https://github.com/auth0/node-jsonwebtoken to decode id_token and get waad profile
      var waadProfile = profile || jwt.decode(params.id_token);
      User.findOne({
        // 'azure.upn': waadProfile.rawObject.upn
        _id: '56949ef7f9357f8186b72b44' // Denia
        // _id: '56e6eca7357ac1483b854c0b' // Adelia
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'User not found' });
        } else {
          return done(err, user);
        }
      })
  }));

  /**
   * Passport untuk get access token only
   */
  passport.use('azureoauthuser', new AzureOAuthStrategy({
      clientId: config.azure.clientID,
      clientSecret: config.azure.clientSecret,
      tenantId: 'common',
      resource: 'https://graph.microsoft.com/' 
  }));

  passport.serializeUser(function (user, next) {
      next(null, user);
  });
  
  passport.deserializeUser(function (id, next) {
      User.findById(id, function (err, user) {
          next(err, user);
      });
  });

  passport.getOAuthAccessToken = function(resource, req, res, next) {
      if (passport.user.hasToken(resource)) {
          // already has access token for the exchange service, 
          // should also check for expiration, and other issues, ignore for now.
          // skip to the next middleware
          return next();
      } else {
          var data = 'grant_type=refresh_token' 
          + '&refresh_token=' + passport.user.refresh_token 
          + '&client_id=' + config.azure.clientID
          + '&client_secret=' + encodeURIComponent(config.azure.clientSecret) 
          + '&resource=' + encodeURIComponent(resource);
          var opts = {
              url: 'https://login.microsoftonline.com/common/oauth2/token',
              body: data,
              headers : { 'Content-Type' : 'application/x-www-form-urlencoded' }
          };
          require('request').post(opts, function (err, response, body) {
              if (err) {
                  return next(err)
              } else {
                  var token = JSON.parse(body);
                  passport.user.setToken(token);
                  return next();
              }
          })
      }
  }
};
