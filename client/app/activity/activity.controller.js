'use strict';
angular.module('roomApp').controller('ActivityCtrl', ['$compile', '$scope', '$http', 'socket', '$filter',function($compile, $scope, $http, socket, $filter) {
    $scope.stories = [];
    var lastId = null,
        scrollInitialized = false;
    var getData = function() {
        if ($scope.scroll.disable) return false;
        $scope.scroll.disable = true; 
        $scope.promise = $http.get('/api/users/get-story-filter/activity/0', {
            cache: false,
            cache: lastId ? true : false,
            params: {
                after: lastId,
                limit: lastId ? 5 : 10
            }
        }).then(function(response) {
            scrollInitialized = true;
            if (response.data.length) {
                lastId = response.data[response.data.length - 1]._id;
                $scope.stories = $scope.stories.concat(response.data);
                $scope.scroll.disable = false;
            }
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
    $scope.$on('main:scroll', function() {
        if (scrollInitialized) {
            getData();
        }
    });
    getData();
}]);