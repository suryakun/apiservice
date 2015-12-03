'use strict';

angular.module('roomApp')
    .controller('HeaderCtrl', function ($scope, $location, Auth, $http) {
    $http.get('/api/users/me').success(function (data) {
        $scope.me = data;
    });
});
