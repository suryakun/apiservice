'use strict';

angular.module('roomApp')
  	.controller('HeaderschoolCtrl', function ($scope, $http, $stateParams) {

  		$scope.school_id = $stateParams.school_id;

    	$http.get('/api/users/me').success(function (data) {
        	$scope.me = data;
    	});
  	});
