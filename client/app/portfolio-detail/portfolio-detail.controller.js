'use strict';
angular.module('roomApp').controller('PortfolioDetailCtrl', ['$scope', 'storyDetailHttp', '$http', 'socket', '$state', '$rootScope', function($scope, storyDetailHttp, $http, socket, $state, $rootScope) {
    $scope.story = storyDetailHttp.data[0];
    $rootScope.$broadcast('story:read', $scope.story);
    $scope.getReply = function(story) {
        $scope.promise = $http.get('/api/stories/' + story._id + '/replies', {
            cache: false
        }).then(function(response) {
            $scope.story.reply = response.data;
        });
    };
    $scope.onSubmitReply = function(story) {
        $scope.promise = $http.post('/api/replies', {
            info: story.newReply,
            story_id: story._id
        }).then(function() {
            story.newReply = '';
        });
    };
    $scope.getDetailGroup = function(story) {
        var result = [];
        angular.forEach(story._class || [], function(value, key) {
            result.push(value.name);
        });
        angular.forEach(story._group || [], function(value, key) {
            result.push(value.name);
        });
        return result.join(', ');
    };
    $scope.back = function() {
        history.back();
    };
    // Event Listeners
    socket.socket.on('reply:save', function(data) {
        if (data._story === $scope.story._id) {
            $scope.getReply($scope.story);
        }
    });
    $scope.$watch('story', function(newVal, oldVal) {
        if (newVal._id) {
            $scope.getReply($scope.story);
        }
    });
}]);