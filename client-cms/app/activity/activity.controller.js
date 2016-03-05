'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$compile', '$scope', '$http', 'socket', '$filter',function($compile, $scope, $http, socket, $filter) {
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/activity/0', {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
            // var timeline = $('#timeline');
            // response.data.forEach(function(value, key) {
            //     var scope = $scope.$new();
            //     scope.story = value;
            //     timeline.append($compile('<li story-card="story"></li>')(scope));
            // });
        });
    };
    var lastDate = null;
    $scope.onInitStory = function(story) {
        if (lastDate === $filter('amDateFormat')(story.createdAt, 'D-MM-Y')) {
            story.hideDate = true;
        } else {
            lastDate = $filter('amDateFormat')(story.createdAt, 'D-MM-Y');
        }
    };
    $scope.$on('activity:created', function() {
        getData();
    });
    getData();
}]);