'use strict';
angular.module('roomApp').controller('CalendarCtrl', ['$scope', '$http', '$compile', 'uiCalendarConfig', function($scope, $http, $compile, uiCalendarConfig) {
    $scope.eventsF = function(start, end, timezone, callback) {
        $scope.promise = $http.get('/api/users/get-my-calendar', {
            cache: false
        }).then(function(response) {
            var events = Array.prototype.map.call(response.data || [], function(event, idx) {
                var start = new Date(event.calendar ? event.calendar.start.dateTime : event.createdAt),
                    end = new Date(event.calendar ? event.calendar.end.dateTime : event.createdAt),
                    isAllDay = start.getTime() === end.getTime();
                start.setHours(0, 0, 0);
                end.setHours(23, 59, 59);
                return {
                    title: event.info,
                    info: event.info,
                    start: start,
                    end: end,
                    allDay: isAllDay,
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
    $scope.eventSources = [
        [], $scope.eventsF
    ];
    $scope.$on('info:created', function() {
        console.log('cannot auto resfresh');
    });
}]);