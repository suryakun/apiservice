var passport = require('passport');
var AzureOAuthStrategy = require('passport-azure-oauth').Strategy;

exports.setup = function (User, config) {
  passport.use(new AzureOAuthStrategy({
    clientId: config.azure.clientID,
    clientSecret: config.azure.clientSecret,
    redirectURL: config.azure.callbackURL,
    tenantId: 'common',
    resource: 'https://graph.microsoft.com'
  },
  function (accessToken, refresh_token, params, profile, done) {
    // currently we can't find a way to exchange access token by user info (see userProfile implementation), so
    // you will need a jwt-package like https://github.com/auth0/node-jsonwebtoken to decode id_token and get waad profile
    console.log('accessToken', accessToken);
    var waadProfile = profile || jwt.decode(params.id_token);
    // return done(waadProfile);

    // this is just an example: here you would provide a model *User* with the function *findOrCreate*
    User.findOrCreate({ id: waadProfile.upn }, function (err, user) {
      return done(err, user);
    });
  }));
  
  passport.getAccessToken = function(resource, req, res, next) {
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
              url: appSettings.apiEndpoints.accessTokenRequestUrl,
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
