'use strict';

angular.module('roomApp')
    .controller('FoundationCtrl', function ($scope, $http, Pagination) {

    	$scope.params = {};

    	$http.get('api/users/me').success(function (data) {
    		console.log(data);
    		$scope.me = data;
    	});

        $http.get('/api/foundations').success(function (data) {
        	console.log(data);
        	$scope.foundations =data;
        	$scope.pagination = Pagination.getNew(5);
        	$scope.pagination.numPages = Math.ceil($scope.foundations.length/$scope.pagination.perPage);
        });

        $scope.addFoundation = function (form) {
        	console.log('test');
        	// if (form.$valid) {
	        // 	$http.post('/api/foundations', $scope.params)
        		
        	// };
        }
    });
