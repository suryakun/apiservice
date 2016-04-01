'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
    }).state('callback', {
        url: '/callback?error&email&token&id&role',
        templateUrl: 'app/login/login.html',
        controller: 'CallbackCtrl'
    }).state('info', {
        url: '/unregister?email',
        templateUrl: 'app/login/info.html'
    });
}]);