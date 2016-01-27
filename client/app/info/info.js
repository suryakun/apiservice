'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.info', {
        url: 'info',
        templateUrl: 'app/info/info.html',
        controller: 'InfoCtrl',
        controllerAs: 'info',
        containerClass: 'no-cover'
    });
}]);