'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl',
        // data: {
        //     accessLevel: AUTHConfig.accessLevels.anon
        // }
    });
}]);