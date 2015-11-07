'use strict';

angular.module('roomApp')
    .controller('FoundationCtrl', function ($scope, $http) {
        $http.get('/api/foundations').success(function (data) {
        	console.log(data);
        	$scope.foundations =data;
        })
    });
