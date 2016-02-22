'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$scope', '$http', 'socket', '$filter',function($scope, $http, socket, $filter) {
    $scope.stories = [];
    var getData = function() {
        $scope.promise = $http.get('/api/users/get-story-filter/activity/0', {
            cache: false
        }).then(function(response) {
            $scope.stories = response.data;
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