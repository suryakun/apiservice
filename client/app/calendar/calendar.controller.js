'use strict';
angular.module('roomApp').controller('CalendarCtrl', ['$scope', '$http', '$compile', 'uiCalendarConfig', function($scope, $http, $compile, uiCalendarConfig) {
    $scope.eventsF = function(start, end, timezone, callback) {
        $scope.promise = $http.get('/api/users/get-my-calendar', {
            cache: false
        }).then(function(response) {
            var events = Array.prototype.map.call(response.data || [], function(event, idx) {
                return {
                    title: event.info,
                    info: event.info,
                    start: new Date(event.calendar ? event.calendar.start.dateTime : event.createdAt),
                    allDay: true,
                    className: ['b-l b-2x b-primary']
                };
            });
            callback(events);
        });
    };
    $scope.eventRender = function(event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: false,
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            eventRender: $scope.eventRender
        }
    };
    $scope.eventSources = [[], $scope.eventsF];
    $scope.$on('info:created', function() {
        console.log('cannot auto resfresh');
    });
}]);