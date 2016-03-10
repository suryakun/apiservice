'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.profile', {
        url: 'profile',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
    });
}]);