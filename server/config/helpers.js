'use strict';

module.exports.checkDirAndCreateIfNotExist = function (dir) {	
	var fs = require('fs');

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
}