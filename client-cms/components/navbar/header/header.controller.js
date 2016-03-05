'use strict';

angular.module('cmsApp')
    .controller('HeaderCtrl', function ($scope, $location, Auth, $http, sidebar, $state, $stateParams) {
    $http.get('/api/users/me').success(function (data) {
        $scope.me = data;
    });

    $scope.typeController = $state.current.controller;
});
