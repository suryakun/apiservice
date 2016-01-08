'use strict';

angular.module('roomApp')
  .service('sidebar', function () {

  	function Menu () {
	  	var menu = this;

	  	menu.menuType = 'foundation';
	  	menu.id = null;

	  	menu.setMenuType = function (menuType, id) {
	  		menu.menuType = menuType;
	  		menu.id = id;
	  	}
  	}

  	return new Menu;

  });
