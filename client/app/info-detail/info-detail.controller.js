'use strict';
angular.module('roomApp').controller('InfoDetailCtrl', ['$scope', 'storyDetailHttp', '$http', 'socket', '$state', '$rootScope', 'appAuth', function($scope, storyDetailHttp, $http, socket, $state, $rootScope, appAuth) {
    $scope.story = storyDetailHttp.data[0];
    (function() {
        $scope.promise = $http.post('/api/stories/read-story', {
            cache: false,
            data: {
                story_id: $scope.story._id,
                user_id: appAuth.profile._id
            }
        }).then(function(response) {
            $rootScope.$broadcast('story:readed', $scope.story);
            $scope.story.reply = response.data;
        });
    })();
    $rootScope.$broadcast('story:readed', $scope.story);
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
        if ($scope.story.type === 'activity') {
            $state.go('main.activity');
        } else {
            history.back();
        }
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