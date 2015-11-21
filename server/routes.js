/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/groups', require('./api/group'));
  app.use('/api/readstatus', require('./api/read-status'));
  app.use('/api/replies', require('./api/reply'));
  app.use('/api/photos', require('./api/photo'));
  app.use('/api/stories', require('./api/story'));
  app.use('/api/teachers', require('./api/teacher'));
  app.use('/api/histories', require('./api/history'));
  app.use('/api/parents', require('./api/parent'));
  app.use('/api/students', require('./api/student'));
  app.use('/api/classes', require('./api/class'));
  app.use('/api/levels', require('./api/level'));
  app.use('/api/schools', require('./api/school'));
  app.use('/api/foundations', require('./api/foundation'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
