'use strict';
angular.module('roomApp').config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('main.calendar', {
        url: 'calendar',
        templateUrl: 'app/calendar/calendar.html',
        controller: 'CalendarCtrl',
        containerClass: 'animated fadeIn'
    });
}]);