'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.notification', {
        url: 'notification',
        templateUrl: 'app/notification/notification.html'
    });
}]);