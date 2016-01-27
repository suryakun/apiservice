'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.activity', {
        url: 'activity',
        templateUrl: 'app/activity/activity.html',
        controller: 'ActivityCtrl',
        controllerAs: 'activity',
        containerClass: 'no-cover'
    });
}]);