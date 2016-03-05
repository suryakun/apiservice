/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// process.env.NODE_ENV = 'development';

var express = require('express');
var mongoose = require('mongoose');
var vhost = require('vhost');
var config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var mainApp = express();
var app = express();

var server = require('http').createServer(mainApp);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio')(socketio);
require('./config/express')(app);
require('./routes')(app);

//cms routing subdomain
var cmsApp = express();
require('./config/express-cms')(cmsApp);
require('./routes-cms')(cmsApp);

mainApp.use(vhost('dashboard.7pagi.dev',cmsApp));
mainApp.use(vhost('7pagi.dev',app));

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
